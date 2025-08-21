#!/usr/bin/env python3
"""
Dependency Installation Script for FinAnalytica AI Backend
"""

import subprocess
import sys
import os

def install_dependencies():
    """Install all required dependencies"""
    print("🔧 Installing FinAnalytica AI Backend Dependencies")
    print("=" * 50)
    
    # Check if pip is available
    try:
        subprocess.run([sys.executable, "-m", "pip", "--version"], check=True, capture_output=True)
    except subprocess.CalledProcessError:
        print("❌ Error: pip is not available")
        return False
    
    # Install from requirements.txt
    try:
        print("📦 Installing packages from requirements.txt...")
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ All dependencies installed successfully!")
            return True
        else:
            print("❌ Error installing dependencies:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def verify_installation():
    """Verify that all critical dependencies are installed"""
    print("\n🔍 Verifying Installation")
    print("-" * 30)
    
    critical_deps = [
        "crewai",
        "langchain_groq", 
        "groq",
        "langchain",
        "feedparser",
        "bs4",
        "flask",
        "requests"
    ]
    
    missing = []
    
    for dep in critical_deps:
        try:
            __import__(dep)
            print(f"✅ {dep}")
        except ImportError:
            print(f"❌ {dep}")
            missing.append(dep)
    
    if missing:
        print(f"\n❌ Missing dependencies: {', '.join(missing)}")
        return False
    
    print("\n✅ All critical dependencies are installed!")
    return True

def main():
    """Main function"""
    print("🚀 FinAnalytica AI Backend - Dependency Installer")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("requirements.txt"):
        print("❌ Error: requirements.txt not found!")
        print("   Please run this script from the backend directory.")
        return
    
    # Install dependencies
    if install_dependencies():
        # Verify installation
        if verify_installation():
            print("\n🎉 Installation completed successfully!")
            print("   You can now run the backend with: python run.py")
        else:
            print("\n⚠️  Installation completed but some dependencies may be missing.")
            print("   Please check the verification output above.")
    else:
        print("\n❌ Installation failed!")
        print("   Please check the error messages above.")

if __name__ == "__main__":
    main()
