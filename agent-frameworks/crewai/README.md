# CrewAI

Multi-agent orchestration framework.

## Installation
```bash
pip install crewai
```

## Key Concepts
- **Agent**: Role-based AI worker
- **Task**: Work to be done
- **Crew**: Team of agents
- **Process**: Sequential or hierarchical

## Quick Start
```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Researcher",
    goal="Find information",
    backstory="Expert researcher"
)

task = Task(
    description="Research AI trends",
    agent=researcher
)

crew = Crew(agents=[researcher], tasks=[task])
result = crew.kickoff()
```

## Links
- Docs: https://docs.crewai.com
