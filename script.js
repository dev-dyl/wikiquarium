var fishList;



$(document).ready(function(){

    

    fishList = [];

    

    $("nav").hide();

    $("#navigation").hide();

    

    $(".playground").animate({

        top: "0",

        height: "100vh"

    }, 2500, function(){

        $("nav").slideDown();

    });

    

    

    $("#menu-button").click(function(){

        $("#navigation").slideToggle();

    });

    //setInterval(() => {driver()}, 10000);
    driver();

});

// y = a*sin(px) where a = amplitude and p = periodcity
// https://en.wikipedia.org/wiki/Special:Random

class Fish {

    // Link
    // Scale
    // Id
    // PosX
    // YOffset
    // Direction
    // amplitude
    // periodcity

    //wikiObj:
    /*
    canonicalurl: "https://en.wikipedia.org/wiki/Florence_Bagley"
    contentmodel: "wikitext"
    editurl: "https://en.wikipedia.org/w/index.php?title=Florence_Bagley&action=edit"
    fullurl: "https://en.wikipedia.org/wiki/Florence_Bagley"
    lastrevid: 1055969490
    length: 6676
    ns: 0
    pageid: 51199835
    pagelanguage: "en"
    pagelanguagedir: "ltr"
    pagelanguagehtmlcode: "en"
    title: "Florence Bagley"
    touched: "2022-05-06T05:35:49Z"
    */

    constructor(id, startingX, startingY){
        console.log("Constructing " + id);
        this.id = id;
        // Math.random returns a value between 0 and 1
        // Allowing -5 <= amplitude <= 4 and 0.1 <= period <= 3;
        this.amplitude = (Math.floor(Math.random() * 10) - 5);
        let tmp = Math.random() * 4;
        this.periodcity = (tmp < 0.1) ? 0.1 : tmp;

        this.PosX = startingX;
        this.PosY = startingY;

        this.findLink().then((value) => {
            console.log(value);
            this.wikiObj = value;
        });

        //this.findLink().then((value) => {this.link = value});
        
        //console.log(this);
    }

    getId(){
        console.log("Returning " + this.id);
        return this.id;
    }

    nextPosition(dx){
        let x = this.PosX + dx;
        let y = this.amplitude * Math.sin(this.periodcity * x);
        // derivative at x + dx in radians
        let theta = (this.amplitude * this.periodcity) * Math.cos(this.periodcity * x);
        // convert to degrees
        theta = theta * (180/Math.PI);

        let output = {
            'x' : x,
            'y' : y,
            'theta' : theta
        };

        return output;
    }

    getHTML(){
        console.log(this.link);
        if(this.link){
            return '<div class="fish-container" id="fish-' + this.id + '><a href="' +  this.link + '>' + this.link.split("/").pop() + '</a>"</div>';
        }
        else{
            return null;
        }
        
    }

    async findLink(){
        /*
        console.log("Finding " + this.id);
        let myLink = new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("HEAD", 'https://en.wikipedia.org/wiki/Special:Random');
            let loc = xhr.getResponseHeader("location");
            if(loc != null){
                resolve(loc);
            }
            else{
                reject("ERR - No Location");
            }
        });
        let link = myLink.then((value)=>{return value;},(error)=>{return error;});
        return await link;
        */
        let prom = new Promise((resolve,reject) => {
            let xhr = new XMLHttpRequest();
            const url = 'https://en.wikipedia.org/w/api.php';
            const params = {
                action: "query",
                format: "json",
                prop: "info",
                inprop: "url",
                generator: "random",
                grnlimit: "1",
                grnnamespace: "0"
            };
    
            var endpoint = url + "?origin=*";
            Object.keys(params).forEach((key)=>{endpoint += ("&" + key + "=" + params[key]);});
    
            xhr.open("GET", endpoint, true);
            xhr.onload = function(){
                let data = JSON.parse(this.response);
                resolve(Object.values(data.query.pages)[0]);
            }
            xhr.send();
        });
        
        return prom;

    }

}

async function driver(){

    let thisFish = new Fish(fishList.length, -100, ($(window).height / 2));
    console.log(thisFish);
    fishList.push(thisFish);
    moveFish(thisFish.getId());
    
}



function moveFish(fishID){
    console.log("Moving " + fishID);
    var currentPos = parseInt($("#fish-" + fishID).css("left"));

    if(currentPos > 0){

        $("#fish-" + fishID).animate({left: "0"}, 2500, function(){

            $("#fish-" + fishID).css('transform', 'scaleX(-1)');

            moveFish(fishID);

        });

        

    }

    else{

        $("#fish-" + fishID).animate({left: ($(window).width() - $("#fish-" + fishID).width())+"px"}, 2500, function(){

            $("#fish-" + fishID).css('transform', 'scaleX(1)');

            moveFish(fishID);

        });

    }

}

