#!/usr/bin/env python3
"""
Run script for the FinAnalytica AI Backend
"""

import os
import sys
from app import app
from config import config

def setup_groq_api_key():
    """Interactive setup for Groq API key"""
    print("\n🔑 Groq API Key Configuration")
    print("-" * 40)
    
    # Check if GROQ_API_KEY is already set
    current_key = os.environ.get('GROQ_API_KEY')
    
    if current_key and current_key != 'your-groq-api-key-here':
        print("✅ GROQ_API_KEY is already configured")
        return True
    
    print("📝 Groq API Key is required for AI-powered features:")
    print("   - AI analysis and recommendations")
    print("   - Portfolio optimization")
    print("   - AI agent functionality")
    print("\n💡 Get your free API key from: https://console.groq.com/")
    
    # Try to get from user input
    try:
        api_key = input("\nEnter your Groq API key (or press Enter to skip): ").strip()
        
        if api_key:
            # Set the environment variable
            os.environ['GROQ_API_KEY'] = api_key
            print("✅ Groq API key configured successfully!")
            
            # Also update the app context
            app.GROQ_API_KEY = api_key
            
            return True
        else:
            print("⚠️  No API key provided. AI features will use fallback methods.")
            return False
            
    except KeyboardInterrupt:
        print("\n⚠️  API key setup cancelled. AI features will use fallback methods.")
        return False

def main():
    """Main function to run the Flask application"""
    
    print("=" * 60)
    print("🚀 FinAnalytica AI Backend Starting...")
    print("=" * 60)
    
    # Get environment
    env = os.environ.get('FLASK_ENV', 'development')
    
    # Load configuration
    app.config.from_object(config[env])
    
    # Set up logging
    import logging
    logging.basicConfig(
        level=getattr(logging, app.config['LOG_LEVEL']),
        format=app.config['LOG_FORMAT']
    )
    
    # Print startup information
    print(f"\n📊 Configuration:")
    print(f"   Environment: {env}")
    print(f"   Debug Mode: {app.config['DEBUG']}")
    print(f"   API Version: {app.config['API_VERSION']}")
    print(f"   Cache Duration: {app.config['CACHE_DURATION']} seconds")
    print(f"   Port: {os.environ.get('PORT', 5000)}")
    
    # Setup Groq API key
    groq_configured = setup_groq_api_key()
    
    print("\n" + "=" * 60)
    
    # Summary of system status
    print("📋 System Status:")
    print(f"   Groq API: {'✅ Configured' if groq_configured else '⚠️  Using fallback'}")
    
    # Check if we should continue
    if not groq_configured and env == 'development':
        print("\n⚠️  Warning: Groq API key not configured!")
        print("   AI features will use fallback methods (keyword-based analysis).")
        print("   For full AI functionality, configure your Groq API key.")
        
        try:
            response = input("\nDo you want to continue anyway? (y/N): ").strip().lower()
            if response not in ['y', 'yes']:
                print("🛑 Server startup cancelled by user")
                sys.exit(0)
        except KeyboardInterrupt:
            print("\n🛑 Server startup cancelled by user")
            sys.exit(0)
    
    # Run the application
    try:
        port = int(os.environ.get('PORT', 5000))
        print(f"\n🌐 Starting server on http://localhost:{port}")
        print("   Frontend URL: http://localhost:3000")
        print("   API Base URL: http://localhost:5000/api")
        print("   Press Ctrl+C to stop the server")
        print("=" * 60)
        
        app.run(
            host='0.0.0.0',
            port=port,
            debug=app.config['DEBUG']
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 