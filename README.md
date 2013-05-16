#The SMS Voting-Game

## Rules
- You get 1 vote and a pin number when you register by texting your name
- You give 1 vote when you text someone elses pin number
- You don't have to register to vote for someone
- You can't vote for yourself
- You can't vote for anyone more than once

## Ideas
- Exponential point scoring
- Display amount to be donated to charity on the scoreboard
- Pin numbers vs. names
    - pins are harder to guess, you have to talk to someone to vote for them / have them vote for you
    - names might be easier and lesse clunky
- Graph network relationships instead of number of votes per participant

- Analytics:
  - Top participant (person who's given most votes)
  - Top recipient (person who's receive the most votes)

#TODOs

- Deployment to... somewhere, nodejitsu?
- SMS'ing via http://burstsms.com.au
- Try sigma.js for graphing
- A "stop" button to freeze the game


### Alternative theme

Connecting
1. Register  
2a. I can connect to you  
2b. You can connect to me  

Winners are
- most mutual connections
- most persistant (outbound connections)
- hoarder (most in bound connections)

# Privacy concerns?
- Once the stop button has been pressed replace phone numbers with automatically generated IDs
