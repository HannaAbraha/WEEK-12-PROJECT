class Payroll {
    constructor(name) {
        this.name = name;
        this.positions = [];
    }

    addPosition(name, salary) {
        this.salary.push(new salary(name, salary));
    }
}

class Position {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
}

class PayrollService {
    static url = 'https://640a0f10d16b1f3ed6e55258.mockapi.io/payroll';
    // console.log(PayrollService);

    static getAllPayrolls() {
        return $.get(this.url);
    }

    static getPayroll(id) {
        return $.get(this.url + `/${id}`);
    }

    static createPayroll(payroll) {
        console.log(payroll);
        return $.post(this.url, payroll);
    }

    static updatePayroll(payroll) {
        return $.ajax({
            url: this.url + `/${payroll._id}`,
            dataType: 'json',
            data: JSON.stringify(payroll),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deletePayroll(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static payrolls;

    static getAllPayrolls() {
        PayrollService.getAllPayrolls().then(payrolls => this.render(payrolls));
    }

    static createPayroll(name) {
        PayrollService.createPayroll(new Payroll(name))
            .then(() => {
                return PayrollService.getAllPayrolls();
            })
            .then((payrolls) => this.render(payrolls));
    }

    static deletePayroll(name) {
        PayrollService.deletePayroll(new Payroll(name))
            .then(() =>{
                return PayrollService.getAllPayrolls();
            })
            .then((payrolls) => this.render(payrolls));
    }

    static addEmployee(id) {
        for (let payroll of this.payrolls) {
            if(payroll._id == id) {
                payroll.positions.push(new Position($(`#${payroll._id}-employee-name`).val(), $(`#${payroll._id}-employee-salary`).val()));
                PayrollService.updatePayroll(payroll)
                    .then(() => {
                        return PayrollService.getAllPayrolls();
                    })
                    .then((payrolls) => this.render(payrolls));
            }
        }
    }

    static deleteEmployee(payrollId, employeeId) {
        for (let payroll of this.payrolls) {
            if (payroll._id == payrollId) {
                for (let employee of payroll.positions) {
                    if (employee._id == employeeId) {
                        payroll.positions.splice(payroll.positions.indexOf(room), 1);
                        PayrollService.updatePayroll(payroll)
                            .then(() => {
                                return PayrollService.getAllPayrolls();
                            })
                            .then((payrolls) => this.render(payrolls));
                    }
                }
            }
        }
    }

    static render(payrolls) {
        this.payrolls = payrolls;
        $(`#app`).empty();
        for (let payroll of payrolls) {
            console.log("text payroll,",payroll);
            $('#app').prepend(
                `<div id="${payroll._id}" class="card">
                    <div class="card-header">
                        <h2>${payroll.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deletePayroll('${payroll._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                   <input type="text" id="${payroll._id}-employee-name" class="form-control" placeholder="Employee Name"> 
                                </div>
                                <div class="col-sm">
                                   <input type="text" id="${payroll._id}-employee-salary" class="form-control" placeholder="Employee Salary">
                                </div>
                            </div>
                            <button id="${payroll._id}-new-employee" onclick="DOMManager.addEmployee('${payroll._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let employee of payroll.positions) {
                $(`#${payroll._id}`).find('.card-body').append(
                 `<p>
                    <span id="name-${employee._id}"><strong>Name: </strong> ${employee.name}</span>
                    <span id="salary-${employee._id}"><strong>Salary: </strong> ${employee.salary}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteEmployee('${payroll._id}', '${employee._id}')">Delete Employee</button>`
                );
            }
        }
    }

}

$('#create-new-employee').click(() => {
    DOMManager.createPayroll($('#new-employee-name').val());
    $('#new-employee-name').val('');
});

DOMManager.getAllPayrolls();