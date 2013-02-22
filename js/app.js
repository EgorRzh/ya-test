/**
  For run not in browser just call Events.init() or CheckLimiter() for running corresponding task.
*/
window.document.addEventListener('DOMContentLoaded', function(){
  Events.init();  //Uncomment for checking event model 
  //CheckLimiter(); //Uncomment for checking work of limiter
}, false);

var Events = {
  
  loadTypes: [
    {func: 10, ctx: 10, ev: 10},
    {func: 100, ctx: 10, ev: 10},
    {func: 10, ctx: 100, ev: 10},
    {func: 10, ctx: 10, ev: 100}
  ],
  
  ev: [],
  ctx: [],
  func: [],
  
  init: function(){
    for(var i = 0; i < this.loadTypes.length; i++){
      console.time('Load');
      console.profile();
      
      this.creatingEntities(this.loadTypes[i]);
      this.binding();
      this.triggering();
      this.unbinding();
      this.reset();
      
      console.profileEnd();
      console.timeEnd('Load');
    }
  },
  
  creatingEntities: function(type){
    for(var i in type){
      for(var x = 0; x < type[i]; x++){
        this[i].push(this[i+'Generator'](x));
      }
    }
  },
  
  binding: function(type){
    for(var i = 0; i < this.ctx.length; i++){
      for(var y = 0; y < this.func.length; y++){
        for(var z = 0; z < this.ev.length; z++){
          edm().on(this.ev[z], this.func[y], this.ctx[i]);
        }
      }
    }
  },
  
  triggering: function(){
    for(var i = 0; i < this.ev.length; i++){
      edm().trigger(this.ev[i]);
    }
  },
  
  unbinding: function(){
    while(this.ev.length > 0){
      var events = edm().events,
          eventN = this.getRandomInt(this.ev.length-1),
          event = this.ev[eventN],
          callbackN = this.getRandomInt(events[event].length-1);
      edm().off(event, events[event][callbackN].callback, events[event][callbackN].ctx);
      if(events[event].length == 0){
        this.ev.splice(eventN, 1);
      }
    }
  },
  
  reset: function(){
    this.ev = [];
    this.ctx = [];
    this.func = [];
  },
  
  getRandomInt: function(max)
  {
    return Math.floor(Math.abs(Math.random() * (max - 1)));
  },
  
  funcGenerator: function(i){
    return function(){}
  },
  
  ctxGenerator: function(i){
    return {name: 'obj'.concat(i)};
  },
  
  evGenerator: function(i){
    return 'event'.concat(i);
  }

}

CheckLimiter = function(){
  
  function checked(){
    console.log('checked');
  }
  
  var checkedLim = limiter(checked, 500);
  
  setInterval(checkedLim, 1);
}



