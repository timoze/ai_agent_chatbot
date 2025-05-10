import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger("ai-chat-api")


def log_api_call(route: str, request_data: Dict[str, Any], response_data: Dict[str, Any], status_code: int = 200) -> None:
    """Log API call details for monitoring and debugging."""
    logger.info(
        f"API Call: {route} - Status: {status_code}\n"
        f"Request: {request_data}\n"
        f"Response: {response_data}"
    )


def log_error(route: str, error: Exception, request_data: Dict[str, Any] = None) -> None:
    """Log API errors for troubleshooting."""
    logger.error(
        f"Error in {route}: {str(error)}\n"
        f"Request data: {request_data if request_data else 'N/A'}"
    )