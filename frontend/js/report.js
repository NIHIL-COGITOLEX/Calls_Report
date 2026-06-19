function createReport(teamData) {

    const employees =
        teamData.employees
            .map(emp => {

                const cls = "present";

                return `
        <tr>
            <td>${emp.name}</td>

            <td>

                <select
                    class="attendance-select present"
                    onchange="updateAttendance(this)"
                >

                    <option
                        value="Present"
                        selected
                    >
                        Present
                    </option>

                    <option
                        value="Absent"
                    >
                        Absent
                    </option>

                </select>

            </td>

            <td>${emp.total_calls}</td>

            <td>${emp.connected_calls}</td>

            <td>${emp.duration}</td>
        </tr>
        `;
            }).join("");

    return `
    <div class="report">

        <div class="report-title">
            ${teamData.team}
            TEAM DAILY REPORT
        </div>

        <table>

            <thead>

                <tr>
                    <th>NAME</th>
                    <th>ATTENDANCE</th>
                    <th>TOTAL CALL</th>
                    <th>CONNECTED CALL</th>
                    <th>TOTAL DURATION</th>
                </tr>

            </thead>


            <tbody>

                ${employees}

                <tr class="total-row">

                    <td>TOTAL</td>

                    <td></td>

                    <td>
                        ${teamData.total_calls}
                    </td>

                    <td>
                        ${teamData.connected_calls}
                    </td>

                    <td>
                        ${teamData.total_duration}
                    </td>

                </tr>

            </tbody>

        </table>

    
        
            <button
            onclick="copyReport(this)"
            class="copy-btn"
            >
            Copy Screenshot
            </button>

    </div>
    `;
}

function updateAttendance(select) {

    if (select.value === "Present") {

        select.classList.remove("absent");
        select.classList.add("present");

    } else {

        select.classList.remove("present");
        select.classList.add("absent");

    }

}