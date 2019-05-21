---
title: Page Visibility API
slug: page-visibility-api
author: Kevin Hakanson
date: 2014-07-03
tags: ["javascript", "angularjs"]
---
I am taking an online **Leadership & Influence for Architects** training series with about 20 architects across the company.  The facilitator requested full attention and to avoid the temptation to multi-task.  Of course, I complied, but I wondered if they could detect infractions from the other attendees.  Then I remembered the [Page Visibility API](http://www.w3.org/TR/page-visibility/) and realized that they could tell if anyone was switching browser tabs to check email or Twitter.  I'm sure that some advertisers use this to force you to watch that 30-second lead-in video ad before consuming the content you came to watch.

I wanted to code something up and give it a try.  The MDN [Using the Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API) document got me started, but I wanted to hook this DOM event into an AngularJS based application.  The following snippet of code will `$broadcast` the values of `document.hidden` and `document.visibilityState` whenever `visibilitychange` fires.

```javascript
    app.run(['$log', '$rootScope', '$document', function($log, $rootScope, $document) {
        $log.debug('listen for visibilitychange event');
        $document.on('visibilitychange', function() {
            $log.info('hidden=' + document.hidden + ' / visibilityState=' + document.visibilityState);
            $rootScope.$broadcast('visibilityChange', document.hidden, document.visibilityState);
        });
    }]);
```

To listen for this event, I hooked up to `$rootScope`, but could have also hooked to a `$scope` from inside a controller.

```javascript
    app.run(['$log', '$rootScope', function($log, $rootScope) {
        $rootScope.$on('visibilityChange', function(event, hidden, visibilityState) {
            $log.info(hidden + ' / ' + visibilityState);
        });
    }]);
```

As I switched tabs, I could see the change between `hidden=true / visibilityState=hidden` and `hidden=false / visibilityState=visible`  However, in Chrome if the tab is on top of its own window, you can switch to a tab on another Chrome window without firing the event.

You may ask why am I spending time on this and how is this relevant to building web applications?  Imagine if your app was using websockets or long polling to communicate with the server.  You may make an app decision to throttle back those requests after a tab goes hidden in order to save the user's resources (e.g. battery or bandwidth). If the application has collaboration features like chat or online presence awareness, the visibility state could provide useful information.  Additionally, if the user has multiple tabs open and their session times out, you might only want to redirect the visible tab back to the login page.  Those are just a few ideas for using the Page Visibility API.