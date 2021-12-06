var contactURLArray = [];
var contactArray = [];
var first = []; // Array of firstNames from JSON files. Used for AutoSearchBar
var loadingContact = 0;
var currentContactIndex = 0; 

// Sets the input box values to a specific contact
function viewCurrentContact(){
    currentContact = contactArray[currentContactIndex];
    console.log("Current Contact: ");
    console.log(contactArray[currentContactIndex]);
    document.getElementById("nameID").value = currentContact.firstName;   
    document.getElementById("emailID").value = currentContact.email;   
    document.getElementById("cityID").value = currentContact.city;   
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;  

    // Todo: Add additional fields.
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contactArray.length;

}

// Goes back one element in contactArray and calls viewCurrentContact()
function previous(){
    if (currentContactIndex > 0) {
        currentContactIndex--;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
}

// Goes forward one element in contactArray and calls viewCurrentContact()
function next(){
    if (currentContactIndex < (contactArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();

}

// Creates a new contact and inserts it into the contactArray
function newContact(){
    console.log('New Contact Added...');
    document.getElementById("warning").innerHTML = ""
    var newContact = {
        firstName : document.getElementById("nameID").value,   
        email : document.getElementById("emailID").value,  
        city : document.getElementById("cityID").value,   
        state : document.getElementById("stateID").value,
        zip : document.getElementById("zipID").value,  
    }
    first.push(newContact.firstName)
    contactArray.push(newContact);
    currentContactIndex = currentContactIndex + 1;
    viewCurrentContact();
    document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray,null,2);
}
// Removes contact from contactArray
function removeContact(){
    if(contactArray.length > 1){
        console.log('Contact Removed...');
        contactArray.splice(currentContactIndex,1)
        first.splice(currentContactIndex,1)
        if(currentContactIndex>=1){
        currentContactIndex = currentContactIndex - 1;
        }
        viewCurrentContact();
        document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray,null,2);
    } else {
        document.getElementById("warning").innerHTML = "YOU NEED AT LEAST ONE CONTACT"
        console.log("YOU NEED AT LEAST ONE CONTACT")
    }
   
}

// Taken from the example code. This function auto-fills the state/city with php/zip
function autoFill() {
    var zip = document.getElementById("zipID").value
    console.log("zip:"+zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    // Register the embedded handler function
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if ((document.getElementById("cityID").value == "") || (document.getElementById("cityID").value == " "))
                document.getElementById("cityID").value = place[0];
            if (document.getElementById("stateID").value == "")
                document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

// This index function needs to make two different calls as using 'JSON.stringify' on the response.json() does not format correctly via console.
async function index() {
    document.getElementById("index").disabled = true;
    const response = await fetch("https://mustangversion1.azurewebsites.net/index.json");
    const contactIndex = await response.text(); // fetches a text version of the index 
    console.log("Index JSON:\n\n" + contactIndex);
    const response2 = await fetch("https://mustangversion1.azurewebsites.net/index.json");
    const contactIndexJ = await response2.json(); // fetches a json version of the index
 
    for (i=0; i<contactIndexJ.length; i++) {
        contactURLArray.push(contactIndexJ[i].ContactURL);
    }
    contactR();
   
    
}

// This contactR function follows the same layout as mustang-lite
function contactR(){
    contactArray.length = 0;
    loadingContact = 0;

    if (contactURLArray.length > loadingContact) {
        nextContact(contactURLArray[loadingContact]);
    }
}

// Logs contactArray into console
function logContacts() {
    console.log(contactArray);
}

function initApplication() {
    console.log('mustang v3!!!');
}

// This nextContact function stores contact objects into a contactArray and logs it to the DOM
async function nextContact(URL) {
   
    const response = await fetch(URL);
    const contactRequest = await response.text();

    console.log(contactRequest);

    var contact;
    contact = JSON.parse(contactRequest);

    var i = (contact.firstName);
    
    first.push(i);
    autocomplete(document.getElementById("myInput"), first);
   
    contactArray.push(contact);

    document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray,null,2);

    document.getElementById("statusID").innerHTML = "Status: Loading " + contact.firstName + " " + contact.lastName;
    loadingContact++;
    if (contactURLArray.length > loadingContact) {
        nextContact(contactURLArray[loadingContact]);
    }
    else {
        document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + contactURLArray.length + ")";
        viewCurrentContact()
        

        //Todo: Sort contacts array.
    }
    
}

// Taken from W3 tutorial and modified
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }

// In conjunction with the above autocomplete function, showLookup() calls viewCurrentContact
function showLookup(){

    var contactLookedUp = document.getElementById("myInput").value;
    var k = 0;
    for(var i = 0; i<contactArray.length;i++){
      
        if(contactArray[i].firstName == contactLookedUp){
            var k = 1;
            document.getElementById("nameID").value = contactArray[i].firstName
            document.getElementById("emailID").value = contactArray[i].email;   
            document.getElementById("cityID").value = contactArray[i].city;   
            document.getElementById("stateID").value = contactArray[i].state;
            document.getElementById("zipID").value = contactArray[i].zip;  
        }
    }
    if(k==0){
        console.log()
    }

}

function loadContactsFromServer() {
    console.log("loadContactsFromServer()");
    contactArray.length = 0;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            contactArray = JSON.parse(this.responseText);
            setStatus("Loaded contacts (" + contactArray.length + ")");
            currentContactIndex = 0;
            viewCurrentContact()
        }
    };
    xmlhttp.open("GET", "load-contacts.php", true);
    xmlhttp.send();   
}

function saveContactsToServer() {
    console.log("saveContactsToServer()");
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('response: ' + this.responseText);
            setStatus(this.responseText)
        }
    };
    xmlhttp.open("POST", "save-contacts.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("contacts=" + JSON.stringify(contactArray));   
}

function setStatus(status) {
    document.getElementById("statusID").innerHTML = status;    
}






