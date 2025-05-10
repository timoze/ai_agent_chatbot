from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse

from app.models.chat import ChatRequest, ChatResponse, ErrorResponse
from app.services.llm_service import llm_service
from app.core.logging import log_api_call, log_error

router = APIRouter()


@router.post("/chat", 
             response_model=ChatResponse, 
             responses={
                 status.HTTP_400_BAD_REQUEST: {"model": ErrorResponse},
                 status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse}
             },
             summary="Send a message to the AI assistant",
             description="""
             Send a message to the AI assistant and get a response.
             You can optionally provide previous messages for conversation context.
             """
             )
async def chat_with_ai(request: ChatRequest):
    """
    Process a chat request and return an AI-generated response.
    
    - **message**: The user's message/question
    - **conversation_id**: Optional ID for continuing existing conversations
    - **previous_messages**: Optional list of previous messages in the conversation
    """
    try:
        if not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        response_data = await llm_service.generate_response(
            user_message=request.message,
            previous_messages=request.previous_messages
        )
        
        response = ChatResponse(
            response=response_data["response"],
            conversation_id=response_data["conversation_id"] if not request.conversation_id else request.conversation_id,
            model_used=response_data["model_used"]
        )
        
        # Log successful API call
        log_api_call(
            route="/chat",
            request_data=request.model_dump(),
            response_data=response.model_dump(),
        )
        
        return response
        
    except HTTPException as e:
        # Re-raise HTTP exceptions
        log_error("/chat", e, request.model_dump())
        raise
        
    except Exception as e:
        # Log and convert other exceptions to HTTP exceptions
        log_error("/chat", e, request.model_dump())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat request: {str(e)}"
        )


@router.get("/health", 
            summary="Health check endpoint",
            description="Check if the API is operational and can connect to the LLM service.")
async def health_check():
    """Check if the API is working correctly."""
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "ok", "service": "ai-chat-api", "provider": llm_service.provider}
    )