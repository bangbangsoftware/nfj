Tardigrade
==========

*Backend*
Needs to read git logs, do graphql (client https://github.com/apollostack/apollo-client), maybe firebase of http://gun.js.org/ 

*Developer*
- I want to adust assumptions on time spent
- Check coverage stats
- Check bug stats
- Estimation stats
- Burn down check

*Tester*

*Product Owner*

*Designer*

*Questions*

- When will it be done?
- What are the features?
- What has been estimated wrong?
- What are the major blockers?
- How much code growth?
- How much test growth?
- Which areas fail tests?
- Time spent on load testing, security audit, documentation, coding, testing, creating requirement - so tactically can see where to invest

BDD -
After story creation link to concrete examples and the mapping (or dropped out) rules

Signup - like slack

* your email
* your role
* Your team's email and roles

*The endless problems with angular2*

27th Jan 17
-----------
angular-cli and karma on it's own where not picking up the tests. I did
consider going through the angular2 webpack tutorial, but time is short
and I just created a fresh repo and all seems fine. I think there was a
lot of throw back from the original repo I folked the project from. There
is nothing left of the original folk anyhow.

25th Jan 17
-----------
The old 

```Uncaught TypeError: Cannot set property 'stack' of undefined```

is back, turns out I didn't put a new service in a provider array in the component annotation. Rubbish error. BTW pouch / couch DB is really really good.

15th Jan 17
-----------
when the core team said angular2 was easier than angular1 they where wrong, zonejs didn't help either. Just burning threw time guessing what is causing:

```Uncaught TypeError: Cannot set property 'stack' of undefined```

Which turns out was a throw back from broken oauth stuff from the repo I folked. Worthless stack trace though. 

```Error: Cannot match any routes: ''```

I guess this is the learning curve.

14th Jan 17
-----------
Just had to follow this [advice](http://stackoverflow.com/questions/41065026/angular-core-version-is-not-a-constructor-after-updating-angular-2)

Which wasted my really precious time, really considering moving to Vue. Even after I downgraded the cli (and running locally), I'm getting the ```Cannot find name 'HammerManager'.``` error... I know materal design packages are in alpha... although angular-material main module is in beta... Any how if upgraded ng-cli to the latest it just didn't work at all (with the latests LTS of node)


