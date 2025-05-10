from typing import Generator
from fastapi import Depends, HTTPException, status
from app.services.llm_service import llm_service

# This file can be used for any dependencies that need to be injected into routes
# Currently, it's minimal but can be expanded if needed

def get_llm_service() -> Generator:
    """
    Dependency to get the LLM service.
    This allows for easy mocking in tests.
    """
    try:
        yield llm_service
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"LLM service unavailable: {str(e)}"
        )