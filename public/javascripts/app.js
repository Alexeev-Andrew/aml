var currentBaseUrl = 'http://localhost:3000'

var current_el;
var current_menu;

var balance = 0;
var user_id = "";
var user_transactions = [];

var showEl = function(id){
    if(id == current_el)
        return;
    $('#'+id+'-form').show();
    $('#'+id+'-btn').addClass("active");
    $('#'+current_el+'-form').hide();
    $('#'+current_el+'-btn').removeClass("active");
    current_el = id;
}

$("#sign-up-btn").click(function() {
    showEl('sign-up');
});

$("#log-in-btn").click(function() {
    showEl('log-in');
});

$("#payments-btn").click(function() {
    showEl('payments');
});

$("#logout-btn").click(function() {
    showEl('logout');
});

$("#balance-btn").click(function() {
    show_balance();
});

let show_balance = function(){
    showEl('balance');
}

$("#transaction-btn").click(function() {
    showEl('transaction');
});

var accounts;
var account;
var address1;

function setStatus(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
};

function refreshBalance(address1,address) {

};

function refresh() {

};


function getBalance(address) {

}

function switchToHooked3(_keystore) {

}

//create Wallet
function RegisterUser() {


    var email = document.getElementById('email').value;
    var firstname = document.getElementById('first-name').value;
    var middlename = document.getElementById('middle-name').value;
    var lastname = document.getElementById('last-name').value;
    var upassword = document.getElementById('Upassword').value;
    var dob = document.getElementById('dob').value;
    var gender;
    var country;
    var aadhar = document.getElementById('aadhar').value;
    if (document.getElementById('g1').checked) {
        gender = document.getElementById('g1').value;
    }
    else if(document.getElementById('g2').checked) {
        gender = document.getElementById('g2').value;
    }
    else if(document.getElementById('g3').checked) {
        gender = document.getElementById('g3').value;
    }

    if (document.getElementById('c1').checked) {
        country = document.getElementById('c1').value;
    }else if(document.getElementById('c2').checked) {
        country = document.getElementById('c2').value;
    }


    $.ajax({
        method: "POST",
        url: `${currentBaseUrl}/authorize/sign_up`,
        crossOrigin: true,
        data: {
            email: email,
            password: upassword,
            first_name: firstname,
            last_name: lastname,
            middle_name: middlename,
            birth: dob,
            passport_id: aadhar,
        },
        success: function (data) {
            localStorage.access_token = data.token_data.access_token;
            localStorage.expires_in = data.token_data.expires_in;
            window.access_token = localStorage.access_token;
            showMenu('prod');
            showEl('balance');
            getBalanceInfo();
        },
        error: function (err) {

        }

    })


};

function GetUserDetails() {

    var userid = document.getElementById("userlogid").value;
    var password = document.getElementById("lpassword").value;
    setStatus("Initiating transaction... (please wait)");

    $.ajax({
        method: "POST",
        url: `${currentBaseUrl}/authorize/sign_in`,
        crossOrigin: true,
        data: {
            email: userid ,
            password:  password,
        },
        success: function (data) {
            localStorage.access_token = data.token_data.access_token;
            localStorage.expires_in = data.token_data.expires_in;
            window.access_token = localStorage.access_token;
            showMenu('prod');
            showEl('balance');
            getBalanceInfo();
        },
        error: function (err){

        }



})

};

function logout() {
    localStorage.clear();
    hideAll();
    showEl('sign-up');
    showMenu('login')
}


function sendCoin() {
    $.ajax({
        method: "POST",
        url: `${currentBaseUrl}/users/add-transaction`,
        crossOrigin: true,
        headers: {
            "authorization": 'Bearer ' + localStorage.access_token
        },
        data: {
            amount: document.getElementById('amount').value
        },
        success: function (data) {
            user_transactions.push(data.transaction);
            balance = data.user.balance;
            update_balance_page();
            update_transaction_page();
        },
        error: function (err) {
            console.log(err.responseJSON.error)
            alert(err.responseJSON.error);
        }
    })
};


function getTransactions() {
    $.ajax({
        method: "GET",
        url: `${currentBaseUrl}/users/getTransactions`,
        crossOrigin: true,
        headers: {
            "authorization": 'Bearer ' + localStorage.access_token
        },
        success: function (data) {
            for(let t of data)
                user_transactions.push(t);
            update_transaction_page();
        },
        error: function (err) {

        }
    })
};

function getBalanceInfo() {
    $.ajax({
        method: "GET",
        url: `${currentBaseUrl}/users/user_info`,
        crossOrigin: true,
        headers: {
            "authorization": 'Bearer ' + localStorage.access_token
        },
        success: function (data) {
            if(data && data[0])
                data = data[0]
            balance = data.balance;
            user_id = data.id;
            update_balance_page();
        },
        error: function (err) {

        }
    })
};

function update_balance_page(){
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = balance;

    var from_address = document.getElementById("SenderBalance");
    from_address.innerHTML = user_id;
}

const template = document.getElementById('transaction-template');
const transaction_row = template.content.querySelector('.transaction')

function update_transaction_page() {
    // todo:
    document.getElementById('transactions-list').innerHTML = ''
    user_transactions.forEach(transaction => {
        const transactionElem = document.importNode(transaction_row , true);
        transactionElem.querySelector('.amount').textContent = '+'+transaction['amount'] + ' BTC2'
        transactionElem.querySelector('.date').textContent = transaction['date'];

        document.getElementById('transactions-list').appendChild(transactionElem)
    });
}

function hideAll(){
    $("#sign-up-form").hide();
    $("#log-in-form").hide();
    $("#balance-form").hide();
    $("#transaction-form").hide();
    $("#logout-form").hide();

    $("#form-selector-login").hide();
    $("#form-selector-prod").hide();
}

function showMenu(id){
    console.log(id+' '+current_menu)
    $("#form-selector-"+current_menu).hide();
    $("#form-selector-"+id).show();
    current_menu = id;
}

window.onload = function() {
    hideAll();
    if(localStorage.expires_in>new Date()){
        showEl('balance')
        showMenu('prod');
        current_el = 'balance';
        current_menu = 'prod';
        getBalanceInfo();
        getTransactions();
    } else {
        showEl('sign-up');
        showMenu('login');
        current_el = 'sign-up';
        current_menu = 'login';
    }



}
