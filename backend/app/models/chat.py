from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ChatMessage(BaseModel):
    """Model for individual chat message."""
    role: str = Field(..., description="Role of the message author (e.g., 'user', 'assistant')")
    content: str = Field(..., description="Content of the message")


class ChatRequest(BaseModel):
    """Model for chat request from user."""
    message: str = Field(..., description="User's message/question", min_length=1)
    conversation_id: Optional[str] = Field(None, description="ID for continuing existing conversations")
    previous_messages: Optional[List[ChatMessage]] = Field(
        default_factory=list,
        description="Previous messages in the conversation"
    )


class ChatResponse(BaseModel):
    content: str = Field(..., description="AI's response content")  # Renamed from 'response'
    conversation_id: str = Field(..., description="ID for the conversation")
    timestamp: datetime = Field(default_factory=datetime.now, description="Timestamp of the response")
    model_used: str = Field(..., description="The LLM model used for generating the response")
    role: str = Field(default="assistant", description="Message author role")  # Add role field
    

class ErrorResponse(BaseModel):
    """Model for error responses."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")