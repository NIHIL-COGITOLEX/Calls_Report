from fastapi import FastAPI, UploadFile, File, Body
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from fastapi.staticfiles import StaticFiles

from services.parser import process_callyzer

from team_mapping import (
    load_mapping,
    save_mapping,
    load_team_leaders,
    save_team_leaders
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    try:

        df = pd.read_excel(file.file)

        df = df.fillna("")

        reports = process_callyzer(df)

        return {
            "success": True,
            "teams": reports
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


@app.get("/team-mapping")
def get_team_mapping():

    return load_mapping()


@app.post("/team-mapping")
def update_team_mapping(
    mapping: dict
):

    save_mapping(mapping)

    return {
        "success": True
    }

@app.get("/team-leaders")
def get_team_leaders():

    return load_team_leaders()


@app.post("/team-leaders")
def update_team_leaders(
    leaders: List[str] = Body(...)
):

    save_team_leaders(
        leaders
    )

    return {
        "success": True
    }


# app.mount(
#     "/",
#     StaticFiles(
#         directory="../frontend",
#         html=True
#     ),
#     name="frontend"
# )
