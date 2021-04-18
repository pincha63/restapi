function pad(n, w = 2, z = 0) {
    return ((n += '').length >= w) ? n : new Array(w - n.length + 1).join(z) + n;
}

function drawElement(eName, u, bcolor, luma) {
    let msgString = "" + pad(u,3,0) + ` :: color ${bcolor} :: luma ${luma}`
    document.getElementById(eName).innerHTML = msgString
    document.getElementById(eName).style.backgroundColor = bcolor
    document.getElementById(eName).style.color = (luma < 3.9) ? "#FFFDFD" : "#000100"
}

function d_str(d, m = 28) {
    // unpack digits as source of R, G, B and transform to color Hex string like #7A6BDD
    let g = (z) => pad((m * z).toString(16), 2, 0).substring(0, 2);
    let d0 = d % 10;
    let d1 = 0.1 * ((d - d0) % 100);
    let d2 = (Math.floor(d / 100)) % 10;
    let [g0, g1, g2] = [d0, d1, d2].map((z) => g(z)); // pad and display as Hex
    return {color: ("#"+g2+g1+g0) , luma: (0.21*d2 + 0.7*d1 + 0.11*d0).toFixed(2)};
}

let internalHandler = (u) => drawElement("cute", u, d_str(u).color, d_str(u).luma)

function externalHandler(u, payload) {
    let myRes = '/tu'
    //myRes = 'https://patovi.nfshost.com/remote'
    fetch(myRes, {
        method: "POST",
        body: payload,
        //headers: {"Content-type": "application/json; charset=UTF-8"}
   })
   .then(response => response.json()) // converts json to javascript object (sic)
   .then(data => {
       //console.log(`Parsed data :: ${data.body.color} :: ${data.body.luma}`);
       drawElement("extr", u, data.body.color, data.body.luma)
   })
   .catch(err => console.log("Server call error"));
}

let r3d = () => Math.floor(1000*Math.random()) // random 3 digits

function run_calc(i=-1, randP=false) { 
    let x = (randP) ? 999 : document.getElementById("fname").value;
    let u = (randP) ? r3d() : parseInt(x.substring(0, 3));
    let v = (randP) ? r3d() : parseInt(x.substring(0, 3));
    let intVal = ((u < 0) || isNaN(u)) ? r3d() : u
    let extVal = ((v < 0) || isNaN(v)) ? r3d() : v
    console.log(`i = ${i} :: internal ${intVal} :: external ${extVal}`)
    internalHandler(intVal)
    externalHandler(447, JSON.stringify({ a: extVal, b: "0" }))
}

let nonRandom = () => run_calc(-999, false)

function randHandler() {
    fn.removeEventListener("input" , nonRandom)
    rn.removeEventListener("click" , randHandler)
    let i = 0
    run_calc(i++, true)
    let intervalP = setInterval(() => {
        run_calc(i, true)
        if (++i === 10) {
            window.clearInterval(intervalP);
            fn.addEventListener("input" , nonRandom);
            rn.addEventListener("click" , randHandler);            
        }
    }, 1330)    
}

let fn = document.querySelector("#fname"); // free text entry field
fn.addEventListener("input" , nonRandom);
let rn = document.querySelector("#randa"); // button Randomize
rn.addEventListener("click" , randHandler);
// the following avoids sending fname=value as a parameter to the URL
fn.addEventListener('keypress', function(event) { 
    if (event.keyCode == 13) { event.preventDefault(); }
});
console.log("Setup done")