# The SMS Voting-Game

## TODOs for Friday demo

- Make network graph readable: ADAM
- Impliment layout on graph page including donation amount: DOM???
- Put instructions in text message with pin number get your friends to text your pin to 614 1891 7876: FRED???

#TODOs

- A "stop" button to freeze the game before announcing winners
- Make D3 scoreboard full viewport width
- More styling on the graph / dashboard
- Display amount to be donated to charity on the scoreboard
- Establishing winning criteria(s)
    - 1st place most in bound connections: hoarder
    - 2nd, 3rd most in bound connections?
    - alternatively
        -most mutual connections
        - most persistant (outbound connections)

## Rules
- You get 1 vote and a pin number when you register by texting your name
- You give 1 vote when you text someone elses pin number
- You don't have to register to vote for someone
- You can't vote for yourself
- You can't vote for anyone more than once

# Decisions made

## Voting and registering

- If you text anything that contains only numbers we consider you to be voting for a pin number
- Players should have a username so that we can display something on screen which is not their phone number or pin number
    - phone numbers = privacy issues
    - pin numbers removes the need to talk to other players

## Winning
- Rules for winning have not been finalised
    - however the winners will not be the top 1-3 players who have voted for the most people as we want to encourage recipricale voting


## Routes

##### Message contents: <username> dispatched to /sms/?mobile=<phone_number>&response=<username>&message_id=0
    if <username> is registered and mobile number matches registered user
        Send back "You are already registered <username>. Your PIN is <pin_no>.
    else if <username> is registered but mobile number does not match:
        Send exception back "User already taken"
    else:
        Register participant with <username> and send "Thank you for registering <username>. Your pin is <pin_no><

##### Message contents: <pin_no> dispatched to /sms/?mobile=<phone_number>&response=<pin_no>&message_id=0
    if <pin_no> exists:
        vote for user corresponding with pin, and return "Thank you for voting to <pin_no>
    else:
        send back error "User with pin <pin_no> not found" (optional)

Constraints:
Pin number must be a NUMBER (no alphabetic chars).

## Ideas
- Exponential point scoring
- Acheivements
- Announcemments:
    - 10 minutes with no votes
    - Player joins the game
    - Player gives / receives 10 votes
    - most votes in under 1 minute
    - ...
- Pin numbers vs. names
    - pins are harder to guess, you have to talk to someone to vote for them / have them vote for you
    - names might be easier and lesse clunky

- Analytics:
  - Top participant (person who's given most votes)
  - Top recipient (person who's receive the most votes)


# Privacy concerns?
- Once the stop button has been pressed replace phone numbers with automatically generated IDs
