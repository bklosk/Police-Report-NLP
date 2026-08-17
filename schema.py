from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class StrictModel(BaseModel):
    """Base model compatible with OpenAI strict structured outputs."""

    model_config = ConfigDict(extra="forbid")


class Officer(StrictModel):
    officer_id: str | None = Field(
        description="Officer identifier from the structured source column."
    )
    name: str | None = Field(
        description="Officer name exactly as supplied in the structured source."
    )


class ReportedVehicle(StrictModel):
    year: str | None
    state: str | None
    make: str | None
    model: str | None
    color: str | None
    style: str | None
    vehicle_type: str | None


class StopAttributes(StrictModel):
    contact_date: str | None
    contact_officer: Officer
    supervisor: Officer
    street: str | None
    city: str | None
    state: str | None
    postal_code: str | None
    frisked: bool | None
    person_searched: bool | None
    vehicle_searched: bool | None
    summons_issued: bool | None
    stop_duration: str | None
    circumstance: str | None
    basis: str | None
    key_situations: list[str] = Field(
        description="Every key-situation category supplied for this stop, preserving "
        "the source category names."
    )
    weather: str | None
    reported_vehicle: ReportedVehicle


class Person(StrictModel):
    id: str = Field(description="Document-local, e.g. 'P1'.")
    mentions: list[str] = Field(
        description="Every surface form referring to this person: 'XXX', "
        "'the operator', 'Mr. XXX', 'his girlfriend', 'front passenger'. "
        "This is how coreference is recorded - do not omit it."
    )
    bpd_person_id: str | None = Field(
        description="Numeric Person ID from structured columns, if matchable."
    )
    sex: Literal["male", "female", "unknown"] | None
    race: str | None
    ethnicity: str | None
    age: int | None
    build: str | None
    hair: str | None
    skin_tone: str | None
    clothing: str | None
    license_info: str | None = Field(description="'MA Class D', 'MA ID Only'.")
    frisked: bool | None
    deceased: bool | None
    residences: list[str] = Field(
        description="Stated residences as free text. Preserve the useful granularity "
        "available in the note, from a neighborhood such as 'Mattapan' to a full "
        "address. Do not create separate location entities for residences."
    )
    affiliations: list[str] = Field(
        description="gang affiliations, written just as the name of the gang; "
        "'Lenox', 'Wood Ave', 'BBMG', 'no gang affiliation'."
    )
    prior_offenses: list[str] = Field(
        description="BOP mentions as written: 'open F/A', 'prior 94C', 'ABDW', "
        "'armed robbery', 'unarmed rob'."
    )
    descriptors: list[str] = Field(
        description="Anything else asserted about the person that is not a "
        "relationship: 'homeless', 'well known con man', "
        "'recently moved back to Boston', 'uses seven aliases'."
    )
    outcomes: list[
        Literal[
            "released",
            "warning",
            "citation",
            "summons",
            "arrested",
            "booked",
            "transported",
            "trespassed",
            "assistance_provided",
            "ems_refused",
            "no_action",
            "other",
        ]
    ] = Field(
        description="Encounter outcomes for this person. Include every applicable "
        "outcome because different people in one report may have different results."
    )


class Vehicle(StrictModel):
    id: str
    year: str | None
    make: str | None
    model: str | None
    color: str | None
    body_style: str | None = Field(description="'sedan', 'SUV', 'moped', 'pickup'.")
    vehicle_type: str | None
    plate_number: str | None = Field(description="Registration as written, often redacted.")
    plate_state: str | None
    attributes: list[str] = Field(
        description="Descriptive facts only: 'stolen', 'rental', 'tinted', "
        "'unregistered', 'heavy front end damage'."
    )
    notes: str | None = Field(
        description="'heavy front end damage', 'no front plate', 'hood rental'."
    )


class Location(StrictModel):
    id: str = Field(description="Document-local location ID, e.g. 'L1'.")
    text: str = Field(description="Location phrase or concise resolved label.")
    latitude: float = Field(
        description="Best-guess WGS84 latitude. For ambiguous or redacted places, "
        "use a defensible street, neighborhood, city, or landmark centroid."
    )
    longitude: float = Field(
        description="Best-guess WGS84 longitude. For ambiguous or redacted places, "
        "use a defensible street, neighborhood, city, or landmark centroid."
    )
    geocoding_confidence: Literal["high", "medium", "low"]

    @model_validator(mode="after")
    def coordinates_are_valid(self) -> "Location":
        if not -90 <= self.latitude <= 90:
            raise ValueError("latitude must be between -90 and 90")
        if not -180 <= self.longitude <= 180:
            raise ValueError("longitude must be between -180 and 180")
        return self


class Item(StrictModel):
    id: str
    item_type: Literal[
        "weapon",
        "drug",
        "cash",
        "paraphernalia",
        "stolen_property",
        "document",
        "electronics",
        "bicycle",
        "clothing_or_equipment",
        "other",
    ]
    description: str = Field(
        description="'black DeWalt folding knife', 'black iPhone'."
    )
    quantity: str | None = Field(
        description="Verbatim, not normalized: 'multiple plastic bags', 'six rounds'."
    )


class PersonConnection(StrictModel):
    person_1_id: str
    person_2_id: str
    relationship: Literal[
        "romantic_partner",
        "sibling",
        "family_member",
        "co_offender",
        "associate",
        "co_incident",
        "other",
    ] = Field(
        description="Use a specific relationship when stated or strongly implied; "
        "otherwise use 'co_incident'."
    )


class PersonVehicleAssociation(StrictModel):
    person_id: str
    vehicle_id: str
    role: Literal[
        "operator",
        "passenger",
        "occupant",
        "owner",
        "renter",
        "borrower",
        "associated",
    ]


class PersonItemAssociation(StrictModel):
    person_id: str
    item_id: str
    relationship: Literal["possesses", "seized_from", "found_with", "associated"]


class FIOReport(StrictModel):
    fc_number: str | None
    case_note: str = Field(
        description="The original police note copied verbatim, without summarization."
    )
    stop_attributes: StopAttributes
    people: list[Person]
    vehicles: list[Vehicle]
    locations: list[Location]
    items: list[Item]
    person_connections: list[PersonConnection] = Field(
        description="A complete undirected graph over people in this report: include "
        "exactly one connection for every unordered pair of person IDs. Use an "
        "empty list when fewer than two people are present."
    )
    person_vehicle_associations: list[PersonVehicleAssociation]
    person_item_associations: list[PersonItemAssociation]

    @model_validator(mode="after")
    def graph_references_are_valid(self) -> "FIOReport":
        person_ids = [person.id for person in self.people]
        if len(person_ids) != len(set(person_ids)):
            raise ValueError("person IDs must be unique")

        expected = {
            frozenset((person_ids[left], person_ids[right]))
            for left in range(len(person_ids))
            for right in range(left + 1, len(person_ids))
        }
        actual: list[frozenset[str]] = []
        for connection in self.person_connections:
            pair = frozenset((connection.person_1_id, connection.person_2_id))
            if len(pair) != 2:
                raise ValueError("person connections cannot be self-edges")
            if not pair.issubset(person_ids):
                raise ValueError("person connection references an unknown person ID")
            actual.append(pair)

        if len(actual) != len(set(actual)):
            raise ValueError("each unordered person pair must appear exactly once")
        if set(actual) != expected:
            raise ValueError(
                "person_connections must contain every unordered person pair"
            )

        location_ids = [location.id for location in self.locations]
        if len(location_ids) != len(set(location_ids)):
            raise ValueError("location IDs must be unique")
        if (
            self.stop_attributes.street
            or self.stop_attributes.city
            or self.stop_attributes.state
        ) and not self.locations:
            raise ValueError(
                "a stop with structured location fields must include a geocoded location"
            )

        vehicle_ids = [vehicle.id for vehicle in self.vehicles]
        if len(vehicle_ids) != len(set(vehicle_ids)):
            raise ValueError("vehicle IDs must be unique")
        known_people = set(person_ids)
        known_vehicles = set(vehicle_ids)
        associated_people: set[str] = set()
        associated_vehicles: set[str] = set()
        for association in self.person_vehicle_associations:
            if association.person_id not in known_people:
                raise ValueError("vehicle association references an unknown person ID")
            if association.vehicle_id not in known_vehicles:
                raise ValueError("vehicle association references an unknown vehicle ID")
            associated_people.add(association.person_id)
            associated_vehicles.add(association.vehicle_id)
        if known_people and known_vehicles - associated_vehicles:
            raise ValueError(
                "every vehicle must be associated with a person when people are present"
            )
        if known_vehicles and known_people - associated_people:
            raise ValueError(
                "every person must be associated with a vehicle when vehicles are present"
            )

        item_ids = [item.id for item in self.items]
        if len(item_ids) != len(set(item_ids)):
            raise ValueError("item IDs must be unique")
        known_items = set(item_ids)
        for association in self.person_item_associations:
            if association.person_id not in known_people:
                raise ValueError("item association references an unknown person ID")
            if association.item_id not in known_items:
                raise ValueError("item association references an unknown item ID")
        return self
