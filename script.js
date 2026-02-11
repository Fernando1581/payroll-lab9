const payrollForm = document.getElementById("payrollForm");

const resetBtn = document.getElementById("resetBtn");

const payrollTbody = document.querySelector("#payrollTbody");

const clearAllBtn = document.querySelector("#clearAllBtn");

let number = 1;

function addRow(e) {
    e.preventDefault();

    const empName = document.getElementById("empName").value;
    const hours = parseFloat(document.getElementById("hours").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const tax = parseFloat(document.getElementById("tax").value);
    const otherDed = parseFloat(document.getElementById("otherDed").value);


    const gross = hours * rate;
    const taxDeduction = gross * (tax/100);
    const netPay  = gross - taxDeduction - otherDed;

    if (payrollForm.dataset.editRow) {
        const row = payrollTbody.rows[payrollForm.dataset.editRow - 1];
        const cells = row.children;

        cells[1].textContent = empName;
        cells[2].textContent = hours;
        cells[3].textContent = rate;
        cells[4].textContent = gross;
        cells[5].textContent = tax;
        cells[6].textContent = otherDed;
        cells[7].textContent = netPay;

        delete payrollForm.dataset.editRow;
    }    
    else {
        payrollTbody.innerHTML += `
            <tr>
                <td>${number++}</td>
                <td>${empName}</td>
                <td>${hours}</td>
                <td>${rate}</td>
                <td>${gross}</td>
                <td data-tax="${tax}">${taxDeduction}</td>
                <td>${otherDed}</td>
                <td>${netPay}</td>
                
                <td><button class="editBtn">Edit</button> <button class="deleteBtn">Delete</button></td>
            </tr>
        `;
    }

    payrollForm.reset();
    updateSummary();
}


payrollForm.addEventListener("submit", addRow);

resetBtn.addEventListener("click", function() {
    payrollForm.reset();
});

payrollTbody.addEventListener("click", function (e) {
    if (e.target.classList.contains("deleteBtn")) {
        e.target.closest("tr").remove();
    }
    updateSummary();
});

payrollTbody.addEventListener("click", function (e) {
    const row = e.target.closest("tr");
    const cells = row.children;

    if (e.target.classList.contains("editBtn")) {

        document.getElementById("empName").value = cells[1].textContent;
        document.getElementById("hours").value = cells[2].textContent;
        document.getElementById("rate").value = cells[3].textContent;
        document.getElementById("tax").value = cells[5].dataset.tax;
        document.getElementById("otherDed").value = cells[6].textContent;

        payrollForm.dataset.editRow = row.rowIndex;  
    }
});

clearAllBtn.addEventListener("click", function() {
    payrollTbody.innerHTML = "";
    number = 1;
})

function updateSummary() {

    const sumEmployees = document.getElementById("sumEmployees");
    const sumGross = document.getElementById("sumGross");
    const sumDed = document.getElementById("sumDed");
    const sumNet = document.getElementById("sumNet");

    const rows = payrollTbody.rows;
    let grossTotal = 0;
    let dedTotal = 0;
    let netTotal = 0;

    for (let i = 0; i < rows.length; i++) {
        grossTotal += Number(rows[i].cells[4].textContent || 0);
        dedTotal   += Number(rows[i].cells[5].textContent || 0)   
                    + Number(rows[i].cells[6].textContent || 0); 
        netTotal   += Number(rows[i].cells[7].textContent || 0);  
    }

    sumEmployees.textContent = payrollTbody.rows.length;
    sumGross.textContent = "₱" + grossTotal;
    sumDed.textContent = "₱" + dedTotal;
    sumNet.textContent = "₱" + netTotal;
}
