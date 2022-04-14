const mainEl = document.querySelector("main");

const getStudents = () => {
    fetch("https://api.hatchways.io/assessment/students", { headers: { method: "GET" } })
        .then(response => {
            if (response.status == 200) {
                response.json()
                    .then(data => {
                        console.log(data.students)
                        renderStudents(data.students);
                    })
            }
        })
}

const renderStudents = studentData => {
    
    for (let i = 0; i < studentData.length; i++) {
        let studentEl = document.createElement("article");

        studentEl.innerHTML = `
        <img src=${studentData[i].pic}>
        <h2>${studentData[i].firstName + " " + studentData[i].lastName}</h2>
        <p>Email: ${studentData[i].email}</p>
        <p>Company: ${studentData[i].company}</p>
        <p>Skill: ${studentData[i].skill}</p>
        <p>Average: ${getAverageGrades(studentData[i].grades)}%</p>
        `
        mainEl.appendChild(studentEl);
    }
}

const getAverageGrades = grades => {
    var total = 0
    for (let i = 0; i < grades.length; i++) {
        total += parseInt(grades[i]);
    }
    return total/grades.length;
}

getStudents();