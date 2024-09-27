

const SECONDS_IN_A_MINUTE = 60;
const SECONDS_IN_AN_HOUR = SECONDS_IN_A_MINUTE * 60;
const SECONDS_IN_A_DAY = SECONDS_IN_AN_HOUR * 24;
const SECONDS_IN_AN_AVERAGE_YEAR = SECONDS_IN_A_DAY * 365.2425;


class FlipDown {
    constructor(uts, el = "flipdown", opt = {}) {
      // If uts is not specified
      if (typeof uts !== "number") {
        throw new Error(
          `FlipDown: Constructor expected unix timestamp, got ${typeof uts} instead.`
        );
      }
  
      // If opt is specified, but not el
      if (typeof el === "object") {
        opt = el;
        el = "flipdown";
      }
  
      // FlipDown version
      this.version = "0.3.2";
  
      // Initialised?
      this.initialised = false;
  
      // Time at instantiation in seconds
      this.now = this._getTime();
  
      // UTS to count down to
      this.epoch = uts;
  
      // UTS passed to FlipDown is in the past
      this.countdownEnded = false;
  
      // User defined callback for countdown end
      this.hasEndedCallback = null;
  
      // FlipDown DOM element
      this.element = document.getElementById(el);
  
      // Rotor DOM elements
      this.rotors = [];
      this.rotorLeafFront = [];
      this.rotorLeafRear = [];
      this.rotorTops = [];
      this.rotorBottoms = [];
  
      // Interval
      this.countdown = null;
  
      // Number of days remaining
      this.daysRemaining = 0;
  
      // Clock values as numbers
      this.clockValues = {};
  
      // Clock values as strings
      this.clockStrings = {};
  
      // Clock values as array
      this.clockValuesAsString = [];
      this.prevClockValuesAsString = [];
  
      // Parse options
      this.opts = this._parseOptions(opt);
  
      // Set options
      this._setOptions();
  
      // Print Version
      console.log(`FlipDown ${this.version} (Theme: ${this.opts.theme})`);
    }
  
  
    start() {
      // Initialise the clock
      if (!this.initialised) this._init();
  
      // Set up the countdown interval
      this.countdown = setInterval(this._tick.bind(this), 1000);
  
      // Chainable
      return this;
    }
  

    ifEnded(cb) {
      this.hasEndedCallback = function () {
        cb();
        this.hasEndedCallback = null;
      };
  
      // Chainable
      return this;
    }
  

    _getTime() {
      return new Date().getTime() / 1000;
    }
  



    _parseOptions(opt) {
      let headings = ["Years","Days", "Hours", "Minutes", "Seconds"];
      if (opt.headings && opt.headings.length === 5) {
        headings = opt.headings;
      }
      return {
        // Theme
        theme: opt.hasOwnProperty("theme") ? opt.theme : "dark",
        headings,
      };
    }

    _setOptions() {
      // Apply theme
      this.element.classList.add(`flipdown__theme-${this.opts.theme}`);
    }

    _init() {
      this.initialised = true;
  
      this.yearsCount = Math.floor((this.now - this.epoch) / SECONDS_IN_AN_AVERAGE_YEAR);
      
      this.yearCountLength = Math.floor((this.now - this.epoch) / SECONDS_IN_AN_AVERAGE_YEAR).toString().length;
      
      var yearRotorCount = this.yearsCount === 0 ? 0 : this.yearCountLength;
      
      this.daysremaining = Math.floor(
       (( this.now - this.epoch) - this.yearsCount*SECONDS_IN_AN_AVERAGE_YEAR) / SECONDS_IN_A_DAY
      ).toString().length;
      
      var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

      // Create and store rotors
      for (var i = 0; i < yearRotorCount + dayRotorCount + 6; i++) {
        this.rotors.push(this._createRotor(0));
      }

      var rotorGroupCount = 0;
      var isYearPresent = false;

      
      
      if(yearRotorCount > 0){
        rotorGroupCount = 1;
        isYearPresent = true;

        // Create year rotor group
      var yearRotors = [];
      for (var i = 0; i < yearRotorCount; i++) {
        yearRotors.push(this.rotors[i]);
      }
      this.element.appendChild(this._createRotorGroup(yearRotors, 0, isYearPresent));
      }

      // Create day rotor group
      var dayRotors = [];
      for (var i = 0; i < dayRotorCount; i++) {
        dayRotors.push(this.rotors[i]);
      }
      this.element.appendChild(this._createRotorGroup(dayRotors, rotorGroupCount, isYearPresent));
      

      // Create other rotor groups
      var count = dayRotorCount + yearRotorCount;
      console.log(`Count:${count}`);
      for (var i = 0; i < 3; i++) {
        var otherRotors = [];
        for (var j = 0; j < 2; j++) {
          otherRotors.push(this.rotors[count]); 
          count++;
        }
        this.element.appendChild(this._createRotorGroup(otherRotors, i + rotorGroupCount + 1, isYearPresent));
      }
  
      // Store and convert rotor nodelists to arrays
      this.rotorLeafFront = Array.prototype.slice.call(
        this.element.getElementsByClassName("rotor-leaf-front")
      );
      this.rotorLeafRear = Array.prototype.slice.call(
        this.element.getElementsByClassName("rotor-leaf-rear")
      );
      this.rotorTop = Array.prototype.slice.call(
        this.element.getElementsByClassName("rotor-top")
      );
      this.rotorBottom = Array.prototype.slice.call(
        this.element.getElementsByClassName("rotor-bottom")
      );
  
      // Set initial values;
      this._tick();
      this._updateClockValues(true);
  
      return this;
    }
  

    _createRotorGroup(rotors, rotorIndex,isYearPresent) {
      var rotorGroup = document.createElement("div");
      rotorGroup.className = "rotor-group";
      var dayRotorGroupHeading = document.createElement("div");
      dayRotorGroupHeading.className = "rotor-group-heading";
      
      if(isYearPresent){
        dayRotorGroupHeading.setAttribute(
          "data-before",
          this.opts.headings[rotorIndex]
        );
      }else{
        dayRotorGroupHeading.setAttribute(
          "data-before",
          this.opts.headings[rotorIndex + 1]
        );
      } 
      rotorGroup.appendChild(dayRotorGroupHeading);
      appendChildren(rotorGroup, rotors);
      return rotorGroup;
    }
  

    _createRotor(v = 0) {
      var rotor = document.createElement("div");
      var rotorLeaf = document.createElement("div");
      var rotorLeafRear = document.createElement("figure");
      var rotorLeafFront = document.createElement("figure");
      var rotorTop = document.createElement("div");
      var rotorBottom = document.createElement("div");
      rotor.className = "rotor";
      rotorLeaf.className = "rotor-leaf";
      rotorLeafRear.className = "rotor-leaf-rear";
      rotorLeafFront.className = "rotor-leaf-front";
      rotorTop.className = "rotor-top";
      rotorBottom.className = "rotor-bottom";
      rotorLeafRear.textContent = v;
      rotorTop.textContent = v;
      rotorBottom.textContent = v;
      appendChildren(rotor, [rotorLeaf, rotorTop, rotorBottom]);
      appendChildren(rotorLeaf, [rotorLeafRear, rotorLeafFront]);
      return rotor;
    }
  

    _tick() {
      // Get time now
      this.now = this._getTime();
      
     
      // Between now and epoch
      var diff = this.now - this.epoch ;
      

      // Days remaining
      this.clockValues.y = Math.floor(diff / SECONDS_IN_AN_AVERAGE_YEAR);
      diff -= this.clockValues.y * SECONDS_IN_AN_AVERAGE_YEAR;

      // Days remaining
      this.clockValues.d = Math.floor(diff / SECONDS_IN_A_DAY);
      diff -= this.clockValues.d * SECONDS_IN_A_DAY;

      // Hours remaining
      this.clockValues.h = Math.floor(diff / SECONDS_IN_AN_HOUR);
      diff -= this.clockValues.h * SECONDS_IN_AN_HOUR;
      
      // Minutes remaining
      this.clockValues.m = Math.floor(diff / SECONDS_IN_A_MINUTE);
      diff -= this.clockValues.m * SECONDS_IN_A_MINUTE;
      
      // Seconds remaining
      this.clockValues.s = Math.floor(diff);
      // Update clock values
      this._updateClockValues();

    }

    _updateClockValues(init = false) {
      // Build clock value strings
      this.clockStrings.y = pad(this.clockValues.y, 1);
      this.clockStrings.d = pad(this.clockValues.d, 2);
      this.clockStrings.h = pad(this.clockValues.h, 2);
      this.clockStrings.m = pad(this.clockValues.m, 2);
      this.clockStrings.s = pad(this.clockValues.s, 2);
     if(this.clockStrings.y == 0){
      // Concat clock value strings when year is present
      this.clockValuesAsString = (
        this.clockStrings.d +
        this.clockStrings.h +
        this.clockStrings.m +
        this.clockStrings.s
      ).split("");
     }else{
      // Concat clock value strings when year is absent
      this.clockValuesAsString = (        
        this.clockStrings.y +
        this.clockStrings.d +
        this.clockStrings.h +
        this.clockStrings.m +
        this.clockStrings.s
      ).split("");
     }
      
      console.log(`days:${this.clockValuesAsString}`);
      // Update rotor values
      // Note that the faces which are initially visible are:
      // - rotorLeafFront (top half of current rotor)
      // - rotorBottom (bottom half of current rotor)
      // Note that the faces which are initially hidden are:
      // - rotorTop (top half of next rotor)
      // - rotorLeafRear (bottom half of next rotor)
      this.rotorLeafFront.forEach((el, i) => {
        el.textContent = this.prevClockValuesAsString[i];
      });
  
      this.rotorBottom.forEach((el, i) => {
        el.textContent = this.prevClockValuesAsString[i];
      });
  
      function rotorTopFlip() {
        this.rotorTop.forEach((el, i) => {
          if (el.textContent != this.clockValuesAsString[i]) {
            el.textContent = this.clockValuesAsString[i];
          }
        });
      }
  
      function rotorLeafRearFlip() {
        this.rotorLeafRear.forEach((el, i) => {
          if (el.textContent != this.clockValuesAsString[i]) {
            el.textContent = this.clockValuesAsString[i];
            el.parentElement.classList.add("flipped");
            var flip = setInterval(
              function () {
                el.parentElement.classList.remove("flipped");
                clearInterval(flip);
              }.bind(this),
              500
            );
          }
        });
      }
  
      // Init
      if (!init) {
        setTimeout(rotorTopFlip.bind(this), 500);
        setTimeout(rotorLeafRearFlip.bind(this), 500);
      } else {
        rotorTopFlip.call(this);
        rotorLeafRearFlip.call(this);
      }
  
      // Save a copy of clock values for next tick
      this.prevClockValuesAsString = this.clockValuesAsString;
    }
  }
  

  function pad(n, len) {
    n = n.toString();

    return n.length < len ? pad("0" + n, len) : n;
  }
  

  function appendChildren(parent, children) {
    children.forEach((el) => {
      parent.appendChild(el);
    });
  }