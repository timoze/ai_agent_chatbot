import uuid
from typing import List, Dict, Any, Optional
import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.core.logging import logger, log_error
from app.models.chat import ChatMessage


class LLMService:
    """Service for interacting with LLM providers."""
    
    def __init__(self):
        """Initialize LLM service based on configuration."""
        self.provider = settings.LLM_PROVIDER.lower()
        
        if self.provider == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError("OpenAI API key is required when using OpenAI provider")
            self.model = settings.OPENAI_MODEL
            import openai
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        elif self.provider == "anthropic":
            if not settings.ANTHROPIC_API_KEY:
                raise ValueError("Anthropic API key is required when using Anthropic provider")
            self.model = settings.ANTHROPIC_MODEL
            import anthropic
            self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        
        elif self.provider == "openrouter":
            if not settings.OPENROUTER_API_KEY:
                raise ValueError("OpenRouter API key is required when using OpenRouter provider")
            self.model = settings.OPENROUTER_MODEL
            self.site_url = settings.OPENROUTER_SITE_URL
            self.site_name = settings.OPENROUTER_SITE_NAME
            # OpenRouter uses direct HTTP requests, so no client initialization needed
        
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")
        
        logger.info(f"LLM Service initialized with provider: {self.provider}, model: {self.model}")

    async def generate_response(
        self, user_message: str, previous_messages: Optional[List[ChatMessage]] = None
    ) -> Dict[str, Any]:
        """Generate a response from the LLM based on user input and conversation history."""
        try:
            conversation_id = str(uuid.uuid4())
            
            if self.provider == "openai":
                response = await self._generate_openai_response(user_message, previous_messages)
            elif self.provider == "anthropic":
                response = await self._generate_anthropic_response(user_message, previous_messages)
            elif self.provider == "openrouter":
                response = await self._generate_openrouter_response(user_message, previous_messages)
            else:
                raise ValueError(f"Unsupported LLM provider: {self.provider}")
            
            return {
                "content": response,
                "conversation_id": conversation_id,
                "model_used": self.model
            }
            
        except Exception as e:
            log_error("generate_response", e, {"message": user_message})
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate response: {str(e)}"
            )

    async def _generate_openai_response(
        self, user_message: str, previous_messages: Optional[List[ChatMessage]] = None
    ) -> str:
        """Generate response using OpenAI API."""
        messages = []
        
        # Add previous messages if any
        if previous_messages:
            for msg in previous_messages:
                messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenAI API
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    async def _generate_anthropic_response(
        self, user_message: str, previous_messages: Optional[List[ChatMessage]] = None
    ) -> str:
        """Generate response using Anthropic API."""
        messages = []
        
        # Add previous messages if any
        if previous_messages:
            for msg in previous_messages:
                messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call Anthropic API
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=messages,
                temperature=0.7,
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise

    async def _generate_openrouter_response(
        self, user_message: str, previous_messages: Optional[List[ChatMessage]] = None
    ) -> str:
        """Generate response using OpenRouter API."""
        messages = []
        
        # Add previous messages if any
        if previous_messages:
            for msg in previous_messages:
                messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenRouter API using httpx for async requests
        try:
            headers = {
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            }
            
            # Add optional headers if available
            if self.site_url:
                headers["HTTP-Referer"] = self.site_url
            if self.site_name:
                headers["X-Title"] = self.site_name
                
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 1000,
                    },
                    timeout=60.0  # Increased timeout for API calls
                )
                
                if response.status_code != 200:
                    logger.error(f"OpenRouter API error: {response.status_code} {response.text}")
                    raise Exception(f"OpenRouter API returned status code {response.status_code}")
                
                response_data = response.json()
                return response_data["choices"][0]["message"]["content"]
                
        except Exception as e:
            logger.error(f"OpenRouter API error: {str(e)}")
            raise


# Create a singleton instance
llm_service = LLMService()