# Smart Calendar Scheduler

## Interface Testing

The project includes a comprehensive testing setup using Jest, Sinon, and sinon-chrome. The tests cover various aspects of the extension, including component rendering, user interactions, and mocking of Chrome APIs.

To run the tests:

```bash
npm run test
```

To generate a coverage report:

```bash
npm run coverage
```

## Prompt Testing

We used OpenAI to test and refine the prompts that would be input for both GPT 3.5 Turbo and GPT 4.0 for this extension. 

We first started with the following prompt:

> Generate a professional, simple sentence that provides availability for the following 5 days based on the provided time slots. Group contiguous time slots together: 

However, this prompt led to some errors as the time zone was not specified, so We altered the prompt more:

> Generate a professional and concise sentence summarizing availability over the next five days, based on the provided time slots. Each time slot marks the start of a 30-minute availability window. Consecutive time slots should be grouped into a single time range (e.g., 3:00 PM and 3:30 PM become 3:00–4:00 PM). Write from the user's perspective, presenting their availability in Eastern Standard Time (EST) in a polished, professional tone: 

This prompt became better as it specified from the user's perspective and the time zone, however it still underperformed, especially on GPT 3.5. Because of this, We decided to use ChatGPT to help it generate better prompts, which it excelled at. Ultimate the following prompt was giving:

> Generate a professional and concise sentence summarizing availability over the next five days, based on the provided time slots. Each time slot marks the start of a 30-minute availability window. Consecutive time slots should be grouped into a single time range (e.g., 3:00 PM and 3:30 PM become 3:00–4:00 PM). Write from the user's perspective, presenting their availability in Eastern Standard Time (EST) in a polished, professional tone:

This prompt gives much better outputs, and consistently makes them readable and easily understandable based on the user input times.

