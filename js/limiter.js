var limiter = function(fn, time) {	
	var lock, execOnUnlock, args;
  
	return function() {
		args = arguments;
		if (!lock) {				
			lock = true;
			var scope = this;
			setTimeout(function(){
				lock = false;
				if (execOnUnlock) {
					args.callee.apply(scope, args);
					execOnUnlock = false;
				}
			}, time);
			return fn.apply(this, args);
		} else {
      execOnUnlock = true;
    }
	}
}