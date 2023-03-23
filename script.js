class Payroll {
    constructor(name) {
        this.name = name;
        this.positions = [];
    }
 //
    addPosition(name, salary) {
        this.positions.push(new Position(name, salary));
    }
}
 //This will create a Position with a name and salary, class will make the data application
class Position {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
}
 //This is the root url for all endpoint to call on from the API, This is a complete payrollservice
class PayrollService {
    static url = 'https://640a0f10d16b1f3ed6e55258.mockapi.io/payroll';
    // console.log(PayrollService);
 //This is a method to get all the payrolls from the url
    static getAllPayrolls() {
        return $.get(this.url);
    }
 //This will give a specific payroll from the url
    static getPayroll(id) {
        return $.get(this.url + `/${id}`); //it is a get request 
    }
 //This will take the Payroll class which has a name and an array and create a payroll
    static createPayroll(payroll) {
        console.log(payroll);
        return $.post(this.url, payroll); // it is a post request
    }
 //This will update the payroll by using ajax method 
    static updatePayroll(payroll) {
        return $.ajax({
            url: this.url + `/${payroll._id}`,
            dataType: 'json',
            data: JSON.stringify(payroll), //this will convert the object into JSON
            contentType: 'application/json',
            type: 'PUT' // it is a put request
        });
    }
 //This will tell the API to delete the id
    static deletePayroll(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static payrolls; // payrolls will represent all the payrolls in this class
 //it will call getAllPayrolls and render them to the DOM
    static getAllPayrolls() {
        PayrollService.getAllPayrolls().then(payrolls => this.render(payrolls));
    }
 //This will create a new payroll then it will request an API from payrollservice and render a payroll
    static createPayroll(name) {
        PayrollService.createPayroll(new Payroll(name))
            .then(() => {
                return PayrollService.getAllPayrolls();
            })
            .then((payrolls) => this.render(payrolls));
    }
 //This will delete the payroll(id) after successfully deleting payroll it will call payrollservice or request API and render payrolls
    static deletePayroll(id) {
        PayrollService.deletePayroll(id)
            .then(() =>{
                return PayrollService.getAllPayrolls();
            })
            .then((payrolls) => this.render(payrolls));
    }
 //This should add a new position 
    static addPosition(id) {
        for (let payroll of this.payrolls) {
            if(payroll._id == id) {
                payroll.positions.push(new Position($(`#${payroll._id}-position-name`).val(), $(`#${payroll._id}-position-salary`).val()));
                PayrollService.updatePayroll(payroll)
                    .then(() => {
                        return PayrollService.getAllPayrolls();
                    })
                    .then((payrolls) => this.render(payrolls));
            }
        }
    }
 //This should delete a position 
    static deletePosition(payrollId, positionId) {
        for (let payroll of this.payrolls) {
            if (payroll._id == payrollId) {
                for (let position of payroll.positions) {
                    console.log(position);
                    if (position._id == positionId) {
                        payroll.positions.splice(payroll.positions.indexOf(position), 1);
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
        $(`#app`).empty(); //div form the html, it will be empty everytime it render
        for (let payroll of payrolls) {
            console.log("text payroll,",payroll);
            $('#app').prepend(
                `<div id="${payroll._id}" class="card">  
                    <div class="card-header">
                        <h2>${payroll.name}</h2> 
                        <button class="btn btn-danger" onclick="DOMManager.deletePayroll('${payroll._id}')">Delete</button>
                    </div>
                    <div class="card-body">nnn
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                   <input type="text" id="${payroll._id}-position-name" class="form-control" placeholder="Position Name"> 
                                </div>
                                <div class="col-sm">
                                   <input type="text" id="${payroll._id}-position-salary" class="form-control" placeholder="Position Salary">
                                </div>
                            </div>
                            <button id="${payroll._id}-new-position" onclick="DOMManager.addPosition('${payroll._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let Position of payroll.positions) {
                $(`#${payroll._id}`).find('.card-body').append(
                 `<p>
                    <span id="name-${Position._id}"><strong>Name: </strong> ${Position.name}</span>
                    <span id="salary-${Position._id}"><strong>Salary: </strong> ${Position.salary}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deletePosition('${payroll._id}', '${Position._id}')">Delete Position</button>`
                );
            }
        }
    }

}
 //This will create a new payroll by calling the DOM manager and passing the new value payroll
$('#create-new-payroll').click(() => {
    DOMManager.createPayroll($('#new-payroll-name').val());
    $('#new-payroll-name').val('');
});

DOMManager.getAllPayrolls();