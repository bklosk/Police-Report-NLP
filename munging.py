import polars as pl

columns = [
    "recnum",
    "person_id",
    "fc_num",
    "contact_date",
    "sex",
    "race",
    "age",
    "build",
    "hair_style",
    "skin_tone",
    "ethnicity",
    "otherclothing",
    "deceased",
    "license_state",
    "license_type",
    "was_frisked",
]
schema = {column: pl.String for column in columns}


# contacts
contacts_rms_df = pl.read_csv(
    f"data/contacts/fieldcontact_*_rms.csv",
)
contacts_mark43_df = pl.read_csv(
    f"data/contacts/fieldcontact_*_mark43.csv",
)


# names of stopped people
contact_names_rms_df = pl.read_csv(
    f"data/contact_names/fieldcontact_name_*_rms.csv",
    null_values="NULL",
    schema_overrides=schema,
)
contact_names_mark43_df = pl.read_csv(
    f"data/contact_names/fieldcontact_name_*_mark43.csv",
    null_values="NULL",
    schema_overrides=schema,
)


# Each row is unique to one of the two contact datasets.
contacts_df = pl.concat(
    [contacts_rms_df, contacts_mark43_df],
    how="diagonal_relaxed",
)

# The contact-name source files have the same schema.
contact_names_df = pl.concat(
    [contact_names_rms_df, contact_names_mark43_df],
    how="vertical",
)

# stops
contacts_df.write_csv("data/contacts/fieldcontact_all.csv")
contacts_rms_df.write_csv("data/contacts/fieldcontact_rms.csv")
contacts_mark43_df.write_csv("data/contacts/fieldcontact_mark43.csv")

# names of stopped people
contact_names_df.write_csv("data/contact_names/fieldcontact_name_all.csv")
contact_names_rms_df.write_csv("data/contact_names/fieldcontact_name_rms.csv")
contact_names_mark43_df.write_csv("data/contact_names/fieldcontact_name_mark43.csv")
