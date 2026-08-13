# nlp/ner on police reports

this is a dataset of people stopped on the street by Boston police officers between 2015-2025!

# todo:

llm pass for geocoding (infer location from case note and given street address)
llm pass for outcomes vars (arrest, warning, assisted with miscellaneous task, etc)
change redacted names to roles; llm pass for pseudonomization and role assignment in each case note
(e.g. "xxx was stopped and admitted to battering his girlfriend xxx" -> "[perpetrator 1] was stopped and admitted to battering his girlfriend [victim 1]")

    this should allow us to connect each contact_name associated with a stop with their *role* in the stop
    that should make splink work better

llm pass to build entity-relationship maps from each stop
construct graph from entity-relationship maps

# Notes:

2015-2019 only:

frisked
searchperson
searchvehicle
summonsissued
vehicle_make

schema (for each stop)
fc_num contact_date contact_officer contact_officer_name supervisor supervisor_name street city state zip frisked searchperson searchvehicle summonsissued stop_duration circumstance basis vehicle_year vehicle_state vehicle_make vehicle_model vehicle_color vehicle_style vehicle_type contact_reason

schema (for each person stopped)

# statistics:

out of 33917 stops between 2019-2025, 1910 have key_situation == drugs
