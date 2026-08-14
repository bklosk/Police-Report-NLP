# nlp/ner on police reports

this is a dataset of people stopped on the street by Boston police officers between 2015-2025!

## ner notes:

Example input:

About 12:55AM on Friday, January 17, 2020, Officers conducted a TStop for VALS (Speeding) on a 2018 Kia Sportage Rental, gray in color, bearing MA-RegXXX, in the driveway next toXXX Norfolk Street, Mattapan.

The operator who stated that he did not have his license on him provided a name of XXX with a DOB of XX/XX/XXXX. The operator was unable to provide officers with a connection to the vehicle, stating that someone who he knew only as "XXXrented it.

Due to the fact that the operator was unable to prove to officers that he legally possessed the vehicle in addition to not being able to tell officers a full name of a person who rented the vehicle, all parties were issued an exit order and frisked for officer safety.

The operator was ultimately identified as XXX (DOB: XX/XX/XXXX). XXX, who had multiple prior firearm related entries on his BOP (including an open case firearm case in Norfolk Superior Court from January of 2020), was in the gang database as an active Levant member. XXX did not have a valid driver's license and was placed under arrest for VALs.

The front seat passenger initially provided a name of XXXn with a DOB of XX/XX/XXXX. He was eventually identified as XXX (DOB: XX/XX/XXXX). XXX was on active probation out of Norfolk Superior Court until September of 2021. XXX was in the gang database as an active Levant member. XXX had an open Armed Robbery case out of Suffolk Superior Court from June of 2018. A firearm was located in XXX' waistband.

The back-seat passenger was identified as XXX(DOB: XX/XX/XXXX). XXX was in the gang database as an active Morse Street member. XXX was FIO'ed and released at the scene.

See I202004379 for further.

Example output:

{
"entities":[

    ]

}

## statistics:

out of 33917 stops between 2019-2025, 1910 have key_situation == drugs
