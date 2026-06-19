let mapping = {};

let teamLeaders = [];

const employeeList =
    document.getElementById(
        "employeeList"
    );

const tlList =
    document.getElementById(
        "tlList"
    );

loadData();

async function loadData() {

    const mappingResponse =
        await fetch(
            "/team-mapping"
        );

    mapping =
        await mappingResponse.json();

    const tlResponse =
        await fetch(
            "/team-leaders"
        );

    teamLeaders =
        await tlResponse.json();

    renderTLs();

    render();
}

function renderTLs() {

    tlList.innerHTML = "";

    teamLeaders.forEach(
        (tl, index) => {

            tlList.innerHTML += `

            <div class="employee">

                <input
                    value="${tl}"
                    class="tl-name"
                    data-index="${index}"
                >

                <button
                    onclick="deleteTL(${index})"
                >
                    Delete
                </button>

            </div>

            `;
        }
    );
}

function deleteTL(index) {

    teamLeaders.splice(
        index,
        1
    );

    renderTLs();

    render();
}

function render() {

    employeeList.innerHTML = "";

    Object.keys(mapping)
        .forEach(key => {

            const emp =
                mapping[key];

            employeeList.innerHTML += `

            <div class="employee">

                <input
                    value="${emp.display_name}"
                    data-key="${key}"
                    class="name"
                >

                <select
                    data-key="${key}"
                    class="team"
                >

                    ${teamLeaders.map(tl => `

                        <option
                            value="${tl}"
                            ${emp.team === tl ? "selected" : ""}
                        >
                            ${tl}
                        </option>

                    `).join("")}

                </select>

                <input
                    value="${emp.aliases.join(", ")}"
                    data-key="${key}"
                    class="aliases"
                >

                <button
                    onclick="deleteEmployee('${key}')"
                >
                    Delete
                </button>

            </div>

            `;
        });
}

function deleteEmployee(key) {

    delete mapping[key];

    render();
}

document
    .getElementById(
        "addTL"
    )
    .addEventListener(
        "click",
        () => {

            teamLeaders.push(
                "NEW TEAM"
            );

            renderTLs();

            render();
        }
    );

document
    .getElementById(
        "addEmployee"
    )
    .addEventListener(
        "click",
        () => {

            const key =
                "employee_" +
                Date.now();

            mapping[key] = {

                display_name: "",

                team:
                    teamLeaders[0] || "",

                aliases: []
            };

            render();
        }
    );

document
    .getElementById(
        "saveBtn"
    )
    .addEventListener(
        "click",
        saveData
    );

async function saveData() {

    document
        .querySelectorAll(
            ".tl-name"
        )
        .forEach(input => {

            const index =
                input.dataset.index;

            teamLeaders[index] =
                input.value.trim();
        });

    document
        .querySelectorAll(
            ".name"
        )
        .forEach(input => {

            const key =
                input.dataset.key;

            mapping[key]
                .display_name =
                input.value.trim();
        });

    document
        .querySelectorAll(
            ".team"
        )
        .forEach(input => {

            const key =
                input.dataset.key;

            mapping[key]
                .team =
                input.value;
        });

    document
        .querySelectorAll(
            ".aliases"
        )
        .forEach(input => {

            const key =
                input.dataset.key;

            mapping[key]
                .aliases =
                input.value
                    .split(",")
                    .map(
                        a => a.trim()
                    )
                    .filter(
                        a => a
                    );
        });

    await fetch(

        "/team-leaders",

        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(
                teamLeaders
            )
        }
    );

    await fetch(

        "/team-mapping",

        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(
                mapping
            )
        }
    );

    alert(
        "Saved Successfully"
    );
}
