#!/bin/bash
# Architecture Refactor Plan Viewer
# Path: ARCHITECTURE_REFACTOR_PLAN.md

if [ -f "ARCHITECTURE_REFACTOR_PLAN.md" ]; then
    echo "=== BRAV E-Commerce Architecture Refactor Plan ==="
    echo ""
    cat "ARCHITECTURE_REFACTOR_PLAN.md"
    echo ""
    echo "=== Plan Complete ==="
else
    echo "Error: ARCHITECTURE_REFACTOR_PLAN.md not found."
    echo "Location should be at the root of the frontend project."
    exit 1
fi