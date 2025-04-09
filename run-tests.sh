#!/bin/bash

# Run all tests with Jest
echo "Running all tests..."
npm test -- --watchAll=false

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "✅ All tests passed!"
else
  echo "❌ Some tests failed. Please fix the issues before proceeding."
  exit 1
fi

# Run tests with coverage
echo "Running tests with coverage..."
npm test -- --coverage --watchAll=false

# Check if coverage is sufficient
if [ $? -eq 0 ]; then
  echo "✅ Test coverage is sufficient!"
else
  echo "⚠️ Test coverage may be insufficient. Consider adding more tests."
fi

echo "Test run complete!"
