import json
import os

MAPPING_FILE = "data/team_mapping.json"


def load_mapping():

    if not os.path.exists(MAPPING_FILE):
        return {}

    with open(
        MAPPING_FILE,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


def save_mapping(data):

    with open(
        MAPPING_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            indent=2
        )

TL_FILE = "data/team_leaders.json"


def load_team_leaders():

    if not os.path.exists(TL_FILE):

        return []

    with open(
        TL_FILE,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


def save_team_leaders(data):

    with open(
        TL_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            indent=2
        )