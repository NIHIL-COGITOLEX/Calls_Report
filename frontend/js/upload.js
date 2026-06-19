const uploadBtn =
    document.getElementById(
        "uploadBtn"
    );

uploadBtn.addEventListener(
    "click",
    async () => {

        const file =
            document.getElementById(
                "excelFile"
            ).files[0];

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        const response =
            await fetch(
                "http://127.0.0.1:8000/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

        const data =
            await response.json();

        const reportsDiv =
            document.getElementById(
                "reports"
            );

        reportsDiv.innerHTML = "";

        for (
            const teamName
            in data.teams
        ) {

            reportsDiv.innerHTML +=
                createReport(
                    data.teams[teamName]
                );
        }

    }
);