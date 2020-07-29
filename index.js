var first = new Person("Joel Fry", 1, 65, 35, 100, 89, 56)
var second = new Person("Antone Massengale", 2, 90, 56, 34, 23, 12)
var third = new Person("Rex Banks", 3, 87, 78, 89, 95, 100)
var fourth = new Person("Arthur Kelly", 4, 87, 45, 66, 99, 100)
var fifth = new Person("Ronald Washington", 5, 56, 34, 23, 87, 75)
var tab = [first, second, third, fourth, fifth]
tab = JSON.stringify(tab)
console.log(tab)
document.cookie = "data=" + tab + "; expires= 18 Dec 2020 12:00:00 UTC"
//kod powyzej musi byc uruchomiony tylko raz aby zapisac do cookies informacje, potem mozna go zakomentowac
var startingTab = document.cookie
// console.log(startingTab)
startingTab = startingTab.replace("data=", "")
startingTab = JSON.parse(startingTab)
var currentTab = startingTab
//stworzenie zmiennych ktore przechowuja tablice z obiektami uczniów
// console.log(startingTab)
var mainCopy = null
var bodyCopy = null
//powyzej kopie obiektu main i tablicy, które beda wykorzystywane do przywrocenia stanu poczatkowego, prosze zwrocic uwage ze dane do nich sa pobierane z cookies
var main = { //glowny obiekt
    startingTab: startingTab, //poczatkowa tablica
    currentTab: currentTab, //aktualna tablica np. po zmianach typu usuniecie ucznia
    resultType: 0,  //rodzaj sredniej (procenty itp)
    resultTypes: ["Average[%]", "Average[Letter]", "4.0 Scale"], //rodzaje dostepne
    tabOfPercentages: [],   //tablica wynikow procentowych
    creatingNew: false, //wlasciwosc okreslajaca czy trwa proces tworzenia nowego ucznia
    currentNumberOfAssignments: 5,  //ilosc ocen (wszystkich jakie kiedykolwiek były)
    changesHappened: true, //wlasciwosc okreslajaca czy doszlo do zmiany ocen itp
    currentRealNumberOfAssignments: 5 //ilosc aktualnych ocen
}

for (let i = 0; i < startingTab.length; i++) {
    var tr = document.createElement("tr")
    tr.setAttribute("class", "trForGrades")
    var tdName = document.createElement("td")
    tdName.setAttribute("class", "tdForName")
    tdName.innerText = startingTab[i].name
    tr.appendChild(tdName)
    var tdID = document.createElement("td")
    tdID.innerText = startingTab[i].ID
    tr.appendChild(tdID)
    var avg = 0
    for (let j = 0; j < startingTab[i].tabOfAssignments.length; j++) {
        var now = document.createElement("td")
        now.setAttribute("class", "grades")
        var currentID = "ID." + i + "." + j
        now.setAttribute("id", currentID)
        now.innerText = startingTab[i].tabOfAssignments[j]
        tr.appendChild(now)
        avg += startingTab[i].tabOfAssignments[j]
    }
    avg = Math.round(avg / startingTab[i].tabOfAssignments.length)
    var tdAvg = document.createElement("td")
    tdAvg.setAttribute("id", "avg" + i)
    tdAvg.setAttribute("class", "avg")
    tdAvg.innerText = avg
    tr.appendChild(tdAvg)
    document.getElementById("mainTab").appendChild(tr)
} //tworzenie tabeli i nadanie poszczegolnym polom ID, klas itp

var grades = document.getElementsByClassName("grades")
// for (let i = 0; i < grades.length; i++) {
document.addEventListener("click", function (event) { //stworzenie event listenera na calym dokumencie
    // console.log(event.target.className)
    // console.log(this)
    var that = event.target
    if (grades.clicked != true && event.target.className == "grades" && main.creatingNew == false) { //sprawdzenie czy kliknieto w komorke z oceną, jezeli tak uruchomienie procesu zmiany danej oceny
        // console.log("!!!!!!")
        var tabOfAllAvg = document.getElementsByClassName("avg")
        main.resultType = 0
        document.getElementById("result").innerText = "Average[%]"
        for (let k = 0; k < tabOfAllAvg.length; k++) {
            tabOfAllAvg[k].innerText = main.tabOfPercentages[k]
        }
        grades.clicked = true
        var nowID = event.target.id
        var afterSplit = nowID.split(".")
        var row2 = afterSplit[1]
        row2 = parseInt(row2)
        row2 += 1
        var row = null
        for (let i = 0; i < main.currentTab.length; i++) {
            // console.log(main.currentTab[i].ID)
            // console.log(row2)
            // console.log("????")
            if (row2 == main.currentTab[i].ID) {
                row = i
            }
        }
        // var column = afterSplit[2]
        var all = event.target.parentElement.children
        for (let i = 0; i < all.length; i++) {
            if (all[i] == event.target) {
                var column = i - 2
            }
        }
        console.log("!!!!!")
        console.log(row, column)
        console.log(main.currentTab)
        // console.log(row, column)
        event.target.innerHTML = ""
        var input = document.createElement("input")
        input.type = "number"
        input.min = 0
        input.max = 100
        input.step = 1
        // input.value = 0
        event.target.appendChild(input)
        main.changesHappened = true
        document.addEventListener("keydown", function (event) { //zatwierzenie enterem ktore powoduje zczytanie wartosci z inputa oraz obliczenie sredniej
            // console.log(event.which)
            // console.log(input.value)
            if (event.which == 13) {
                if (input.value == "") {
                    input.value = 0
                }
                if (input.value > 100) {
                    input.value = 100
                }
                input.value = Math.round(input.value)
                main.currentTab[row].tabOfAssignments[column] = parseInt(input.value)
                var newAvg = 0
                for (let i = 0; i < main.currentTab[row].tabOfAssignments.length; i++) {
                    newAvg += main.currentTab[row].tabOfAssignments[i]
                }
                newAvg = Math.round(newAvg / main.currentTab[row].tabOfAssignments.length)
                var toUpdate = "avg" + (row2 - 1)
                // console.log(toUpdate)
                var toUpdateTd = document.getElementById(toUpdate)
                toUpdateTd.innerText = newAvg
                // console.log(main.currentTab)
                that.innerHTML = input.value
                grades.clicked = false
            }
            for (let i = 0; i < 3; i++) { //przeklikniecie rodzajow sredniej koniecczne dla dobrego funkcjonowania programu
                document.getElementById("result").click()
            }
        })
    }
    else if (event.target.className == "tdForName") { //jezeli kliknieto w komorke z imieniem zakolorowanie calego wiersza lub jego odkolorowanie
        var now = event.target
        var nowParent = event.target.parentElement
        console.log(nowParent.style.background)
        if (nowParent.style.background != "rgb(33, 144, 255)") {
            nowParent.style.background = "#2190ff"
        }
        else {
            console.log("!!!!!!!!!!")
            nowParent.style.background = ""
        }
    }
})
// }

document.getElementById("result").addEventListener("click", function () { //klikniecie w srednia i zmiana jej rodzaju
    main.resultType += 1
    main.resultType = main.resultType % 3
    // console.log(main.resultType)
    this.innerText = main.resultTypes[main.resultType]
    var allAvgCells = document.getElementsByClassName("avg")
    // console.log(allAvgCells)
    for (let i = 0; i < allAvgCells.length; i++) {
        var failed = false
        if (main.resultType == 1) {
            if (i == 0) {
                main.tabOfPercentages = []
            }
            main.tabOfPercentages.push(allAvgCells[i].innerText)
        }
        // console.log(main.tabOfPercentages)
        if (main.resultType == 1) {
            var previous = parseInt(allAvgCells[i].innerText)
            if (previous >= 93) {
                previous = "A"
            }
            else if (previous >= 90) {
                previous = "A-"
            }
            else if (previous >= 87) {
                previous = "B+"
            }
            else if (previous >= 83) {
                previous = "B"
            }
            else if (previous >= 80) {
                previous = "B-"
            }
            else if (previous >= 77) {
                previous = "C+"
            }
            else if (previous >= 73) {
                previous = "C"
            }
            else if (previous >= 70) {
                previous = "C-"
            }
            else if (previous >= 67) {
                previous = "D+"
            }
            else if (previous >= 63) {
                previous = "D"
            }
            else if (previous >= 60) {
                previous = "D-"
            }
            else {
                previous = "F"
                failed = true
            }
            if (failed == true) { // w tym miejscu znajduje sie obliczenie czy dac czerwone tło, m.in dlatego w kilku miejscach pojawia się petla for do 3, aby kod trafił w to miejsce 
                allAvgCells[i].innerText = previous
                allAvgCells[i].style.background = "red"
                allAvgCells[i].style.color = "white"
            }
            else {
                allAvgCells[i].innerText = previous
                allAvgCells[i].style.background = ""
                allAvgCells[i].style.color = ""
            }
        }
        else if (main.resultType == 2) {
            var previous = allAvgCells[i].innerText
            // console.log("!")
            // console.log(previous)
            if (previous == "A") {
                previous = "4.0"
            }
            else if (previous == "A-") {
                previous = "3.7"
            }
            else if (previous == "B+") {
                previous = "3.3"
            }
            else if (previous == "B") {
                previous = "3.0"
            }
            else if (previous == "B-") {
                previous = "2.7"
            }
            else if (previous == "C+") {
                previous = "2.3"
            }
            else if (previous == "C") {
                previous = "2.0"
            }
            else if (previous == "C-") {
                previous = "1.7"
            }
            else if (previous == "D+") {
                previous = "1.3"
            }
            else if (previous == "D") {
                previous = "1.0"
            }
            else if (previous == "D-") {
                previous = "0.7"
            }
            else {
                previous = "0.0"
            }
            allAvgCells[i].innerText = previous
        }
        else {
            allAvgCells[i].innerText = main.tabOfPercentages[i]
        }
    }
})

for (let i = 0; i < 3; i++) {
    document.getElementById("result").click()
}

document.getElementById("newStudent").addEventListener("click", function () { //dodawanie studenta
    bodyCopy = document.querySelector("#mainTab").innerHTML
    if (main.creatingNew == false) {
        main.creatingNew = true
        var lastID = main.currentTab[main.currentTab.length - 1].ID + 1
        // console.log(lastID)
        var newPerson = new Person("", lastID, 0, 0, 0, 0, 0)
        if (main.currentRealNumberOfAssignments != 5) {
            var realNumber = main.currentRealNumberOfAssignments
            var helpTab = []
            for (let i = 0; i < realNumber; i++) {
                helpTab.push(0)
            }
            newPerson.tabOfAssignments = helpTab
        }
        main.currentTab.push(newPerson)
        //powyzej tworzenie obiektu, z uwzglednieniem tego ile jest ocen w tabeli i dodawanie do aktualnej tablicy
        var trForNew = document.createElement("tr")
        trForNew.setAttribute("class", "trForGrades")
        var nameTd = document.createElement("td")
        nameTd.setAttribute("class", "tdForName")
        var nameInput = document.createElement("input")
        nameInput.type = "text"
        nameInput.setAttribute("id", "newName")
        nameTd.appendChild(nameInput)
        trForNew.appendChild(nameTd)
        var IDTd = document.createElement("td")
        IDTd.innerText = lastID
        trForNew.appendChild(IDTd)
        for (let i = 0; i < main.currentRealNumberOfAssignments; i++) {
            var assignmentTd = document.createElement("td")
            assignmentTd.setAttribute("id", "ID." + (lastID - 1) + "." + i)
            assignmentTd.innerText = "-"
            assignmentTd.setAttribute("class", "grades")
            trForNew.appendChild(assignmentTd)
        }
        var avgTd = document.createElement("td")
        avgTd.setAttribute("id", "avg" + (lastID - 1))
        avgTd.setAttribute("class", "avg")
        for (let i = 0; i < currentTab.length; i++) {
            var avg = 0
            for (let j = 0; j < currentTab[i].tabOfAssignments.length; j++) {
                avg += currentTab[i].tabOfAssignments[j]
            }
            avg = Math.round(avg / currentTab[i].tabOfAssignments.length)
            // console.log(avg)
        }
        avgTd.innerText = avg
        trForNew.appendChild(avgTd)
        document.getElementById("mainTab").appendChild(trForNew)
        //stworzenie wiersza i dodanie to strony
        document.getElementById("newName").focus()
        document.addEventListener("keydown", function (event) {
            var thatInput = document.getElementById("newName")
            var isFocused = (document.activeElement === thatInput);
            console.log(event.which)
            if (event.which == 16 && isFocused == true) {
                main.creatingNew = false
                // console.log("!!!!!!")
                if (thatInput.value != "") {
                    var properTd = document.getElementById("newName").parentElement.innerText = thatInput.value
                }
                else {
                    var properTd = document.getElementById("newName").parentElement.innerText = "Jan Kowalski"
                }
            }
            for (let i = 0; i < 3; i++) {
                document.getElementById("result").click()
            }
        })
        //powyzej wymuszenie podania imienia i nazwiska, zeby nie mozna bylo miec dwoch "niedokonczonych" nowych uczniow

    }
    main.changesHappened = true
    mainCopy = main
})

document.getElementById("newAssignment").addEventListener("click", function () { //dodanie nowej oceny
    bodyCopy = document.querySelector("#mainTab").innerHTML
    for (let i = 0; i < main.currentTab.length; i++) {
        main.currentTab[i].tabOfAssignments.push(0)
    }
    var titleRow = document.getElementById("titleRow")
    var result = document.getElementById("result")
    var tdNewAssignment = document.createElement("td")
    main.currentNumberOfAssignments += 1
    tdNewAssignment.innerText = "Assignment " + main.currentNumberOfAssignments
    titleRow.insertBefore(tdNewAssignment, result)
    //dodanie komorki w wierszu tytulowym
    // console.log(main.currentTab)
    var trForGrades = document.getElementsByClassName("trForGrades")
    // console.log(trForGrades)
    for (let i = 0; i < trForGrades.length; i++) {
        var thatAvg = trForGrades[i].querySelector(".avg")
        var grades2 = trForGrades[i].querySelectorAll(".grades")
        var number = 0
        for (let i = 0; i < grades2.length; i++) {
            if (grades2[i].innerText != "-") {
                number += parseInt(grades2[i].innerText)
            }
        }
        number = Math.round(number / main.currentTab[i].tabOfAssignments.length)
        thatAvg.innerText = number
        var xTd = document.createElement("td")
        var IdToSet = "ID." + (main.currentTab[i].ID - 1) + "." + (main.currentNumberOfAssignments - 1)
        xTd.setAttribute("id", IdToSet)
        xTd.innerText = "-"
        xTd.setAttribute("class", "grades")
        trForGrades[i].insertBefore(xTd, thatAvg)
    }
    //dodanie komorek do kazdego wiersza z uwzglednieniem przeliczenia sredniej
    for (let i = 0; i < 3; i++) {
        document.getElementById("result").click()
    }
    main.currentRealNumberOfAssignments += 1
    main.changesHappened = true
    mainCopy = main
})

document.getElementById("back").addEventListener("click", function () {
    window.location.reload()
})
//przywrocenie strony od momentu startowego

setInterval(function () { //funckja wykonywujaca sie co chwile, ktora jest odpowiedzialna za sstylowanie pewnych elementow, oblicznie ilosci pustych pol i wartosci selectow
    var allGrades = document.getElementsByClassName("grades")
    var totalNumber = 0
    for (let i = 0; i < allGrades.length; i++) {
        if (allGrades[i].innerText == "-") {
            allGrades[i].style.background = "yellow"
            totalNumber += 1
        }
        else {
            allGrades[i].style.background = ""
        }
    }
    document.getElementById("unsubmitted").innerText = "Number of unsubmitted assignments: " + totalNumber
    //powyzej ilosc pustych pol + kolorowanie ich

    var allTDs = document.querySelectorAll("td")
    for (let i = 0; i < allTDs.length; i++) {
        if (allTDs[i].innerText == "-") {
            allTDs[i].style.textAlign = "center"
        }
        else {
            allTDs[i].style.textAlign = ""
        }
    }
    //powyzej wysrodkowanie "-"
    // console.log(main.changesHappened)
    if (main.changesHappened == true) {
        main.changesHappened = false
        var now = main.currentTab
        // console.log(now)
        document.getElementById("IdToDelete").innerHTML = ""
        for (let i = 0; i < now.length; i++) {
            var nowOption = document.createElement("option")
            nowOption.value = now[i].ID
            nowOption.innerText = now[i].ID
            document.getElementById("IdToDelete").appendChild(nowOption)
        }
        document.getElementById("IdToDeleteColumn").innerHTML = ""
        for (let i = 0; i < main.currentRealNumberOfAssignments; i++) {
            var nowOption2 = document.createElement("option")
            nowOption2.value = i
            nowOption2.innerText = i + 1
            document.getElementById("IdToDeleteColumn").appendChild(nowOption2)
        }
    }
    //powyzej tworzenie opcji do dwoch selectow odpowiedzialnych za usuwanie
}, 1000)

document.getElementById("btToDeleteSelectedRow").addEventListener("click", function () { //usuwanie wiersza
    bodyCopy = document.querySelector("#mainTab").innerHTML
    var IdOfRowToDelete = document.getElementById("IdToDelete").value
    var allRows = document.getElementsByClassName("trForGrades")
    // console.log(allRows)
    for (let i = 0; i < allRows.length; i++) {
        var now = allRows[i].childNodes
        var properTd = now[1]
        if (properTd.innerText == IdOfRowToDelete) {
            var parent = properTd.parentElement
            parent.parentNode.removeChild(parent)
            //usuniecie ze strony
            var properID = null
            for (let i = 0; i < main.currentTab.length; i++) {
                if (main.currentTab[i].ID == IdOfRowToDelete) {
                    properID = i
                }
            }
            main.currentTab.splice(i, 1)
            // main.currentTab[i] = "x"
            //usuniecie z tablicy w obiekcie
            // console.log(properID)
            main.changesHappened = true
        }
    }
    mainCopy = main
})

document.getElementById("btToDeleteSelectedColumn").addEventListener("click", function () { //usuwanie kolumny
    bodyCopy = document.querySelector("#mainTab").innerHTML
    var IdOfColumnToDelete = parseInt(document.getElementById("IdToDeleteColumn").value)
    // console.log("_-____")
    // console.log(IdOfColumnToDelete)
    var IdInTab = IdOfColumnToDelete + 2
    var allRows = document.getElementsByClassName("trForGrades")
    for (let i = 0; i < allRows.length; i++) {
        var now = allRows[i].childNodes
        // console.log(now)
        var properTD = now[IdInTab]
        properTD.parentNode.removeChild(properTD)
    }
    //usuniecie komorek z wierszy
    var title = document.getElementById("titleRow")
    var titleChildNodes = title.children
    var properTitle = titleChildNodes[IdInTab]
    // console.log(titleChildNodes)
    properTitle.parentNode.removeChild(properTitle)
    //usuniecie tytulu
    for (let i = 0; i < main.currentTab.length; i++) {
        main.currentTab[i].tabOfAssignments.splice(IdOfColumnToDelete, 1)
        // console.log(main.currentTab[i].tabOfAssignments)
    }
    //usuniecie z tablicy w elementach tablicy currentTab usunietej oceny
    var trForGrades = document.getElementsByClassName("trForGrades")
    // console.log(trForGrades)
    for (let i = 0; i < trForGrades.length; i++) {
        var thatAvg = trForGrades[i].querySelector(".avg")
        var grades2 = trForGrades[i].querySelectorAll(".grades")
        var number = 0
        for (let i = 0; i < grades2.length; i++) {
            if (grades2[i].innerText != "-") {
                number += parseInt(grades2[i].innerText)
            }
        }
        number = Math.round(number / main.currentTab[i].tabOfAssignments.length)
        thatAvg.innerText = number
    }
    //obliczenie sredniej
    for (let i = 0; i < 3; i++) {
        document.getElementById("result").click()
    }
    main.currentRealNumberOfAssignments -= 1
    main.changesHappened = true
    mainCopy = main
})

document.getElementById("undo").addEventListener("click", function () {
    if (mainCopy != null) {
        main = mainCopy
        document.querySelector("#mainTab").innerHTML = bodyCopy
    }
})
//operacja undo polegajaca na przywroceniu starej tabeli oraz starego obiektu