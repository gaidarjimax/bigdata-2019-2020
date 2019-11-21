const fs = require('fs');
const crypto = require('crypto');

var dirPath = "my-wallet";
var fileName = dirPath + "/wallet.json";

var test = document.getElementById( "register" );
test.addEventListener('click', function(e){
    e.preventDefault();

    if (!fs.existsSync(dirPath)) 
        fs.mkdirSync(dirPath); 

    var hash = crypto.createHash('sha256').update( document.getElementById('email').innerText + document.getElementById('password').innerText ).digest( 'hex' );
    document.getElementById("hashValue").innerText = hash;

    var wallet = {};
    wallet.walletId = hash;

    var alreadyRegistered  = false;

    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        if( JSON.parse( data ).walletId === hash ){
           document.getElementById('errorMessage').innerText =  "Already registered";
           alreadyRegistered = true;
        }
    });

    if( ! alreadyRegistered )
        fs.writeFileSync(fileName, JSON.stringify(wallet) );
});


var test = document.getElementById( "login" );
test.addEventListener('click', function(e){
    e.preventDefault();

    if (!fs.existsSync(dirPath)) 
    {
        document.getElementById('errorMessage').innerText = "directory does not exist";
        return;
    }

    if (!fs.existsSync(fileName)) 
    {
        alert( "file does not exist" );
        return;
    }
        
    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        if( JSON.parse( data ).walletId === document.getElementById("hash").value ){
            document.getElementById('errorMessage').innerText =  "logged in";
        }
        else
        {
            document.getElementById('errorMessage').innerText = "no such user";
        }
    });
});
