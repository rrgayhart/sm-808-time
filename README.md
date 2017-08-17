# sm-808-time

[Link to Original Requirements](https://github.com/splicers/sm-808)

### Requirements

- User can input
  - Song title (e.g. Animal Rights)
  - Beats Per Minute (e.g. 128)

- User can add patterns
  - In the example given:
    - `song <- Kick   |X|_|_|_|X|_|_|_|`
    - `song <- Snare  |_|_|_|_|X|_|_|_|`
    - `song <- HiHat  |_|_|X|_|_|_|X|_|`

- User can ask the song to play

- Generate a real time visual representation of the sequence being played
  - audio not required

```
Playing song at BPM: 128...
|kick|_|hithat|_|kick+snare|_|hithat|_|
...
```
- A song contains multiple patterns being sequenced for different samples.

- A song plays at a given tempo (AKA bpm), the tempo does not need to be able change while the song plays.

- For this exercise, you are expected to implement 3 patterns for the following sounds/samples: kick, snare and hihat (you can use the example pattern or come up with your own).

- The time signature is expected to be 4/4 (if you don't know what that is, don't worry and ignore this instruction).

- The pattern is expected to be 8 steps or more.

- Your code will be executed on the command line or in the browser.

- Try to keep external dependencies to a minimum.

- The output isn't expected to be in sync with the tempo/BPM (bonus points if you manage to do it).