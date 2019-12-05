var fs      = require('fs');
var popup = require('popups');
const prompt = require('electron-prompt');

const ROOT_DIR          = 'root/'
const WALLETS_DIR       = ROOT_DIR + 'wallets/';
const CURRENCIES_PATH   = WALLETS_DIR + 'currencies.json';
const USER_ID_PATH      = '/id.json';
const CURRENCIES        = [ 'ASD', 'DSA', 'QWE', 'EWQ', 'ZXC', 'CXZ' ];

class Manager
{
    init()
    {
        if( ! fs.existsSync( ROOT_DIR ) ){
            fs.mkdirSync( ROOT_DIR );
            fs.mkdirSync( WALLETS_DIR );
            fs.writeFileSync( CURRENCIES_PATH, JSON.stringify( CURRENCIES ) );
            fs.mkdirSync( WALLETS_DIR + 'default' );
            fs.writeFileSync( WALLETS_DIR + 'default/id.json', JSON.stringify([{"currency":"ASD","balance":10000}] ) );
        }
        this.incrementor    = 0;
    }

    createUser()
    {
        var username = document.getElementById( 'username' ).value + this.incrementor++;
        var dirId =  WALLETS_DIR + username;
        
        var currenciesCount = Math.floor( Math.random() * CURRENCIES.length / 2 ) + 1; 
        var accounts = [];

        for( var i = 0; i < currenciesCount; ++i ){
            accounts.push( { 
                currency : CURRENCIES[ i ],
                balance : 0 
            } );
        }

        fs.mkdirSync( dirId );
        fs.writeFileSync( dirId + USER_ID_PATH, JSON.stringify( accounts ) );
        alert( 'New user Id - ' + username );
    }

    _renderUsers( users )
    {
        var usersTag  = document.getElementById( 'users' );
        usersTag.innerHTML = '';
        users.forEach( item => {
            let li                  = document.createElement( 'li' );
            li.innerText            = item.name;
            li.onclick              = (ev) => { this._send( ev.target.innerText ) };
            usersTag.appendChild( li );
        });
    }

    _revealUsersWithCurrency( currency )
    {
        this.currency = currency;
        console.log( this.currency );
        let users = [];
        fs.readdirSync( WALLETS_DIR, { withFileTypes: true } )
        .filter( dirent => dirent.isDirectory() )
        .map( item => {
            let idContent   = JSON.parse( fs.readFileSync( WALLETS_DIR + item.name + USER_ID_PATH, 'utf8' ) );
            if( idContent.find( item => item.currency == currency ) ){
                users.push( item );
            }
        } );

        this._renderUsers( users );
    };

    _send( user ){

        let currency    = this.currency;
        let loggedUser  = this.loggedUser;

        prompt({
            title: 'Choose an amount to send.',
            label: 'Amount',
            value: '0',
            type: 'input'
        })
        .then((amount) => {
            if(amount === null) {
                console.log('user cancelled');
            } else {
                if(!amount) { 
                    console.log( 'error' );
                }
                let recipientpath       = WALLETS_DIR + user + USER_ID_PATH;
                let senderpath          = WALLETS_DIR + loggedUser + USER_ID_PATH;

                var recipientContent    = JSON.parse( fs.readFileSync( recipientpath, 'utf8' ) );
                var senderContent       = JSON.parse( fs.readFileSync( senderpath, 'utf8' ) )

                var canSend = false;

                console.log( currency );
                console.log( parseInt( amount ) );

                senderContent.map( i => {
                    console.log( i.balance );
                    if( i.currency === currency && i.balance >= parseInt( amount ) ){
                        i.balance   -= amount;
                        canSend = true;
                    }
                } );

                if( canSend ){
                    recipientContent.map( i => {
                        if( i.currency === currency ){
                            i.balance = i.balance + parseInt( amount );
                        }
                    } );
                }
                else
                {
                    alert( "Not enough money" );
                    return;
                }

                fs.writeFileSync( recipientpath, JSON.stringify( recipientContent ) );
                fs.writeFileSync( senderpath, JSON.stringify( senderContent ) );
            }
        })
        .catch(console.error);
    }
    login()
    {
        this._login( document.getElementById('userIdLogin').value );
    }
    _login( userId )
    {
        this.loggedUser = fs.readdirSync( WALLETS_DIR, { withFileTypes: true } )
        .filter( dirent => dirent.isDirectory() )
        .find( dirent => dirent.name == userId ).name;
        
        document.getElementById( "loggedUser" ).innerText   = this.loggedUser;

        if( this.loggedUser ){
            document.getElementById( "authorisedContent" ).style.display    = 'block';
            document.getElementById( "logout" ).style.display               = 'block';
            document.getElementById( "loginForm" ).style.display            = 'none';
        }
        

        var usersAccounts = [];
        var idContent = JSON.parse( fs.readFileSync( WALLETS_DIR + this.loggedUser + USER_ID_PATH ) );
        idContent.map( dirent => usersAccounts.push( { currency : dirent.currency, amount : dirent.balance } ) );

        var sidebar         = document.getElementById( 'sidebar' );
        sidebar.innerHTML   = '';
        document.getElementById( 'users' ).innerHTML  = '';
        usersAccounts.forEach( item => {
            let li                  = document.createElement( 'li' );
            let spanCurrency        = document.createElement( 'span' );
            let spanAmount          = document.createElement( 'span' );

            spanCurrency.innerText  = item.currency;
            spanAmount.innerText    = ' ' + item.amount;
            spanCurrency.onclick = (ev) => { this._revealUsersWithCurrency(ev.target.innerText) };

            li.appendChild(spanCurrency);
            li.appendChild(spanAmount);

            sidebar.appendChild( li );
        });
    }
    refresh()
    {
        this._login( this.loggedUser )
    }
    logout()
    {
        this.loggedUser = null;
        document.getElementById( "authorisedContent" ).style.display    = 'none';
        document.getElementById( "logout" ).style.display               = 'none';
        document.getElementById( "loginForm" ).style.display            = 'block';
        document.getElementById( 'sidebar' ).innerHTML  = '';
        document.getElementById( 'users' ).innerHTML  = '';
    }
}

module.exports={
    Manager
}