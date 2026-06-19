import pandas as pd
import re
import json
import os

MAPPING_FILE = "data/team_mapping.json"


def clean_employee_name(name):
    if pd.isna(name):
        return ""

    name = str(name)

    # Remove phone number part
    name = re.sub(r"\(\+?\d.*?\)", "", name)

    return name.strip()


def load_mapping():

    if not os.path.exists(MAPPING_FILE):
        return {}

    try:
        with open(
            MAPPING_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    except Exception:
        return {}


def normalize_name(name):

    name = clean_employee_name(name)

    name = name.lower()

    name = re.sub(
        r"[^a-z ]",
        "",
        name
    )

    name = re.sub(
        r"\s+",
        " ",
        name
    )

    return name.strip()


def get_team_from_mapping(
    employee_name,
    default_team
):

    mapping = load_mapping()

    normalized = normalize_name(
        employee_name
    )

    for _, employee in mapping.items():

        aliases = employee.get(
            "aliases",
            []
        )

        aliases = [
            normalize_name(alias)
            for alias in aliases
        ]

        if normalized in aliases:
            return employee.get(
                "team",
                default_team
            )

    return default_team


def parse_duration(duration):

    if pd.isna(duration):
        return 0

    text = str(duration).strip()

    if text == "":
        return 0

    hours = 0
    minutes = 0
    seconds = 0

    h = re.search(
        r"(\d+)\s*h",
        text
    )

    m = re.search(
        r"(\d+)\s*m",
        text
    )

    s = re.search(
        r"(\d+)\s*s",
        text
    )

    if h:
        hours = int(h.group(1))

    if m:
        minutes = int(m.group(1))

    if s:
        seconds = int(s.group(1))

    return (
        hours * 3600
        + minutes * 60
        + seconds
    )


def seconds_to_duration(
    total_seconds
):

    total_seconds = int(
        total_seconds
    )

    h = total_seconds // 3600

    m = (
        total_seconds % 3600
    ) // 60

    s = total_seconds % 60

    return (
        f"{h}h {m}m {s}s"
    )


def safe_number(value):

    if pd.isna(value):
        return 0

    if value == "":
        return 0

    try:
        return int(float(value))

    except Exception:
        return 0


def safe_text(value):

    if pd.isna(value):
        return ""

    return str(value).strip()


def process_callyzer(df):

    df = df.fillna("")

    reports = {}

    for _, row in df.iterrows():

        employee_name = clean_employee_name(
            row.get(
                "Employee",
                ""
            )
        )

        excel_team = safe_text(
            row.get(
                "TL Name",
                "UNASSIGNED"
            )
        )

        team = get_team_from_mapping(
            employee_name,
            excel_team
        )

        attendance = safe_text(
            row.get(
                "Presentee",
                ""
            )
        )

        total_calls = safe_number(
            row.get(
                "Total Calls",
                0
            )
        )

        connected_calls = safe_number(
            row.get(
                "Connected Calls",
                0
            )
        )

        duration_text = safe_text(
            row.get(
                "Total Duration",
                ""
            )
        )

        duration_seconds = parse_duration(
            duration_text
        )

        if team not in reports:

            reports[team] = {
                "team": team,
                "total_calls": 0,
                "connected_calls": 0,
                "total_duration_seconds": 0,
                "employees": []
            }

        reports[team][
            "total_calls"
        ] += total_calls

        reports[team][
            "connected_calls"
        ] += connected_calls

        reports[team][
            "total_duration_seconds"
        ] += duration_seconds

        reports[team][
            "employees"
        ].append({

            "name":
                employee_name,

            "attendance":
                attendance,

            "total_calls":
                total_calls,

            "connected_calls":
                connected_calls,

            "duration":
                duration_text
                if duration_text
                else "0h 0m 0s"
        })

    for team in reports:

        reports[team][
            "total_duration"
        ] = seconds_to_duration(
            reports[team][
                "total_duration_seconds"
            ]
        )

        del reports[team][
            "total_duration_seconds"
        ]

    return reports