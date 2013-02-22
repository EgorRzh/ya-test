  /**
  Events has interface:
  
    edm({object}).on('string of on or more events with space as delimiter', callback, context);
    If context will not set than current object will be as context.
    
    edm({object}).off('string of events which should be off', callback, context);
    all parameters are optional. If any attributes will not be set then all events are off.
    
    edm({object}).trigger('string of events which should be triggered');
  
*/  
  edm = function(obj){
    obj = (!obj)?edm.defObject:obj;
    if(!obj.edm) return new EDM(obj)
    return obj.edm;
  }
  
  edm.defObject = {};
  
  EDM = function(obj){
    obj.edm = this;
    this.initObj = obj;
    this.events = [];
  }

  EDM.prototype = {
  
    on: function(evName, callback, context){
      if(!evName) throw new Error('Cannot bind empty event');
      var evList = (''+evName).toLowerCase().split(' '),                //can be used regular expression '/s+/' for better readability
          events =  this.events; 
          
      for(var i = 0; i < evList.length; i++){
        if(typeof events[evList[i]] === 'undefined') {
          events[evList[i]] = [];
        }
        var clbck = {
          callback: callback
        };
        if(context){
          clbck.ctx = context;
        }
        events[evList[i]].push(clbck);
      }
      return this;
    },
      
    off: function(evName, callback, context){
      var events = this.events;
      evName = (!evName)?'all':evName;
      switch(evName){
        
        case 'all':
          this.events = {};
          break;
          
        default:
          var evList = (''+evName).toLowerCase().split(' ');
          for(var i = 0; i < evList.length; i++){
            var event = evList[i];
            if(events.hasOwnProperty(event)){
              for(var x = 0; x < events[event].length; x++){
                var evIn = events[event][x];
                if(callback === evIn.callback && context === evIn.ctx){
                  
                }
              }
              if(callback){
                for(var x = 0; x < events[event].length; x++){
                  if((events[event][x].callback === callback) 
                      && (!context 
                          || context === events[event][x].ctx 
                          || (context === window && !events[event][x].ctx)
                          )){
                    events[event].splice(x, 1);
                  }
                }
              }
              else{
                events[event] = [];
              }
            }
          }
          break;
      }
      return this;
    },
      
    trigger: function(evName){
      if(!evName) throw new Error('Cannot trigger empty event');
      var evList = (''+evName).toLowerCase().split(' '),
          events = this.events;
      for(var e = 0; e < evList.length; e++){
        for(var i = 0; i < events[evList[e]].length; i++){
          if(events[evList[e]][i].ctx){
            events[evList[e]][i].callback.call(events[evList[e]][i].ctx, events[evList[e]][i]);
          }
          else{
            events[evList[e]][i].callback.call(this.initObj, events[evList[e]][i]);
          }
        }
      }
      return;
    }
  }
  