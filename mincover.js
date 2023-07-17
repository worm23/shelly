// it seems like there is no way to stop the cover process while closing/opening 
// when a certain minimum cover is reached. But at least it's possible to reset 
// it to the minimum when it's not opening/closing anymore
//
// This script listens for the Status handler and only tries to reset the cover when a certain position is reached
let minCover = 15;


let startMonitor = false;

if (Shelly.getComponentConfig("sys").device.profile === "cover") {
  Shelly.addStatusHandler(function(e) {
    if (e.component === "cover:0") {
      if (e.delta.state === "closing" || e.delta.state === "opening") {
        print("Cover is now closing");
        startMonitor = true;
      }
      /*
      print(e.delta.current_pos);
      print(startMonitor);
            print(maxCover);
            print(e.delta.current_pos < maxCover);
      */
      if (startMonitor === true && e.delta.current_pos < maxCover) {
        print("Cover moved to < 15% -> stop it");
        Shelly.call("Cover.GoToPosition", {'id': 0, 'pos': maxCover});
      }
      
      if (e.delta.state === "stopped" || e.delta.state === "closed" || e.delta.state === "open") {
        print("Cover is not opening anymore");
        print(e.delta.state);
        startMonitor = false;
      }
    }
  });
 }
