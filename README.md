# The SMS Voting-Game

Heroku URL http://morning-shore-2216.herokuapp.com/

## Rules
- You register and receive a PIN # by texting your full name
- You connect to other Minglers by texting their PIN #
- You have to register to connect to another Mingler
- You can't connect to yourself
- You can't connect to someone else more than once
- The donation to charity is the number of minglers + the total number of connections * 4

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
