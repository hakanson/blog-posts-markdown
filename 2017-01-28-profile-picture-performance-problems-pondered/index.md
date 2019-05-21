---
title: Profile Picture Performance Problems Pondered
slug: profile-picture-performance-problems-pondered
author: Kevin Hakanson
date: 2017-01-28
tags: ["caching","http","web"]
---
In researching browser component UX timings for a project, I found some a slow requests. Here is the likely culprit:

[![Kevin Hakanson profile picture](images/pastedImage_4.png)](images/pastedImage_4.png)

Well, not **Kevin Hakanson** the person, but his profile photo which is base64 encoded and included in the body of the JSON response, bloating the size to 105KB and likely adding extra time as well.

[![](images/pastedImage_1.png)](images/pastedImage_1.png)

That exact same image data is included in multiple responses; both from different endpoints and repeated calls to the same endpoint.

`/api/profiles/v1/users/F4EB32BB5B1D4F86B126FE07E65CB2D3`

[![](images/pastedImage_3.png)](images/pastedImage_3.png)

`/api/profiles/v1/staff-availability/0D08931CA24D498DB6CD6800194B463B`

[![](images/pastedImage_2.png)](images/pastedImage_2.png)

On the surface, this redundancy seems easy to fix: replace `photo` / `profilePicture` with `photoURL` / `profilePictureURL` and add some HTTP caching headers.  After that, the image request will only be made once.  However, if the profile picture image data is being sourced from another system (like an identity provider), there may still be a problem.  There might not be direct URL access to the image and even then, the caching headers may not be set to ensure that any profile picture updates take effect immediately.  It may still be necessary to proxy the image data request.

With any caching solution, there is a trade-off between performance and stale data.  One solution to this problem is to generate a unique image URL for every photo.  A new image would get a new URL.  Something like:

`/api/profiles/v1/users/F4EB32BB5B1D4F86B126FE07E65CB2D3/photo/{hash-of-image-data}`

This URL will uniquely and deterministically map to that exact image data so the HTTP response can be cached "forever" by the browser.  Also, since the image response can now be binary data instead of a base64 string, there will be about a 25% savings in bytes transmitted.

With the browser performance problem solved, the server can decide it's caching strategy, including how often it wants to consult the source of truth and if it wants to cache the image data or just store the hash value.  Profile picture changes don't happen that often, and if they primarily happen in the UI, they are easy to track and manage the cache.  As few as 1 trip to get the image data might be needed for most sessions.

There are certainly edge cases, and this isn't intended to be a full design, but a topic worth investigating.