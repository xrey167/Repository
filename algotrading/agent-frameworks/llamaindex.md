# LlamaIndex

## Overview
LlamaIndex is a data framework for LLM applications. Specializes in connecting LLMs with external data through indexing, retrieval, and query interfaces.

## Key Features
- Data connectors (100+)
- Indexing structures
- Query engines
- Retrieval strategies
- Agent capabilities
- Evaluation tools
- Production deployment

## Components

| Component | Description |
|-----------|-------------|
| Data Connectors | Load from any source |
| Documents | Structured data units |
| Nodes | Indexed chunks |
| Indices | Retrieval structures |
| Query Engines | Retrieval + synthesis |
| Agents | Autonomous reasoning |

## Installation

```bash
pip install llama-index
```

## Example

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# Load documents
documents = SimpleDirectoryReader("data").load_data()

# Create index
index = VectorStoreIndex.from_documents(documents)

# Query
query_engine = index.as_query_engine()
response = query_engine.query("What is this document about?")
```

## Index Types
- **VectorStoreIndex**: Embedding-based retrieval
- **SummaryIndex**: Full document access
- **TreeIndex**: Hierarchical summaries
- **KeywordTableIndex**: Keyword extraction

## Use Cases
- RAG applications
- Document Q&A
- Knowledge bases
- Data analysis
- Enterprise search

## Links
- [Website](https://llamaindex.ai)
- [Documentation](https://docs.llamaindex.ai)
- [GitHub](https://github.com/run-llama/llama_index)
- [LlamaHub](https://llamahub.ai)
