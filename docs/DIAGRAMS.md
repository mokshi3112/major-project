# Academic Verification System - Diagrams

## 1. System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Application]
        WEB3[Web3.js]
        MM[MetaMask Wallet]
    end
    
    subgraph "Blockchain Layer"
        GANACHE[Ganache Local Network]
        ADMIN[Admin Contract]
        EMP[Employee Contract]
        ORG[Organization Contract]
    end
    
    subgraph "External Services"
        FB[Firebase Notifications]
    end
    
    subgraph "Users"
        ADM[Admin User]
        EMPU[Employee User]
        ORGU[Organization User]
    end
    
    ADM --> UI
    EMPU --> UI
    ORGU --> UI
    
    UI --> WEB3
    WEB3 --> MM
    MM --> GANACHE
    
    GANACHE --> ADMIN
    GANACHE --> EMP
    GANACHE --> ORG
    
    ADMIN -.manages.-> EMP
    ADMIN -.manages.-> ORG
    
    UI -.notifications.-> FB
    
    style UI fill:#61dafb
    style GANACHE fill:#f9a825
    style ADMIN fill:#764abc
    style EMP fill:#764abc
    style ORG fill:#764abc
```

## 2. Skill Endorsement Workflow

```mermaid
sequenceDiagram
    participant E as Employee
    participant UI as React App
    participant W3 as Web3.js
    participant MM as MetaMask
    participant BC as Blockchain
    participant EC as Employee Contract
    participant O as Organization
    
    E->>UI: Login with MetaMask
    UI->>MM: Request account
    MM-->>UI: Account address
    
    E->>UI: Add Skill (name, experience)
    UI->>W3: Call addSkill()
    W3->>MM: Request signature
    MM->>E: Confirm transaction
    E->>MM: Approve
    MM->>BC: Send transaction
    BC->>EC: Execute addSkill()
    EC-->>BC: Skill stored
    BC-->>UI: Transaction confirmed
    UI-->>E: Skill added successfully
    
    E->>UI: Request endorsement
    UI->>FB: Send notification
    FB-->>O: Notify organization
    
    O->>UI: Login with MetaMask
    O->>UI: Navigate to Endorse Skill
    O->>UI: Enter employee address & skill details
    UI->>W3: Call endorseSkill()
    W3->>MM: Request signature
    MM->>O: Confirm transaction
    O->>MM: Approve
    MM->>BC: Send transaction
    BC->>EC: Execute endorseSkill()
    EC->>EC: Update skill with rating & review
    EC-->>BC: Skill endorsed
    BC-->>UI: Transaction confirmed
    UI-->>O: Endorsement successful
    
    E->>UI: View profile
    UI->>EC: Get skill data
    EC-->>UI: Return endorsed skill
    UI-->>E: Display endorsed skill with rating
```

## 3. Smart Contract Architecture

```mermaid
graph LR
    subgraph "Admin Contract"
        A1[Employee Registry]
        A2[Organization Registry]
        A3[Create Employee]
        A4[Create Organization]
    end
    
    subgraph "Employee Contract"
        E1[Skills Management]
        E2[Certifications]
        E3[Work Experience]
        E4[Education]
        E5[endorseSkill]
        E6[endorseCertification]
    end
    
    subgraph "Organization Contract"
        O1[Employee List]
        O2[Organization Info]
        O3[Add Employee]
    end
    
    A3 -->|deploys| E1
    A4 -->|deploys| O1
    A1 -.stores.-> E1
    A2 -.stores.-> O1
    
    O3 -.links.-> E1
    
    style A1 fill:#f9a825
    style E1 fill:#4caf50
    style O1 fill:#2196f3
```

## 4. User Journey Map

```mermaid
graph TD
    START[System Start]
    
    subgraph "Admin Flow"
        A1[Admin Login]
        A2[Create Organization]
        A3[Create Employee]
        A4[Deploy Contracts]
        A5[Manage System]
    end
    
    subgraph "Employee Flow"
        E1[Employee Login]
        E2[Update Profile]
        E3[Add Skills]
        E4[Add Certifications]
        E5[Add Work Experience]
        E6[Request Endorsements]
        E7[View Verified Profile]
    end
    
    subgraph "Organization Flow"
        O1[Organization Login]
        O2[View Employees]
        O3[Endorse Skills]
        O4[Verify Certifications]
        O5[Confirm Work Experience]
    end
    
    START --> A1
    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> A5
    
    START --> E1
    E1 --> E2
    E2 --> E3
    E3 --> E4
    E4 --> E5
    E5 --> E6
    E6 --> E7
    
    START --> O1
    O1 --> O2
    O2 --> O3
    O3 --> O4
    O4 --> O5
    
    E6 -.notification.-> O2
    O3 -.updates.-> E7
    O4 -.updates.-> E7
    O5 -.updates.-> E7
    
    style A1 fill:#f9a825
    style E1 fill:#4caf50
    style O1 fill:#2196f3
```

## 5. Data Flow Diagram

```mermaid
flowchart TD
    START([User Action])
    
    UI[React UI]
    WEB3[Web3.js Layer]
    MM[MetaMask]
    BC[Blockchain Network]
    SC[Smart Contract]
    
    START --> UI
    UI --> WEB3
    WEB3 --> MM
    MM --> |Sign Transaction| BC
    BC --> SC
    SC --> |Execute Function| STORE[Store on Blockchain]
    STORE --> |Emit Event| BC
    BC --> |Transaction Receipt| WEB3
    WEB3 --> UI
    UI --> |Update State| DISPLAY[Display to User]
    
    style START fill:#9c27b0
    style UI fill:#61dafb
    style MM fill:#f6851b
    style BC fill:#f9a825
    style SC fill:#764abc
    style STORE fill:#4caf50
    style DISPLAY fill:#00d1b2
```

---

## How to Use These Diagrams

### For PowerPoint:
1. Copy the Mermaid code
2. Use [Mermaid Live Editor](https://mermaid.live) to render
3. Export as PNG/SVG
4. Insert into your presentation

### For Markdown Documents:
- These diagrams will render automatically in GitHub, VS Code (with Mermaid extension), or any Markdown viewer that supports Mermaid

### For Documentation:
- Keep this file in your project repository
- Reference in your README or technical documentation

---

## Diagram Descriptions

**System Architecture**: Shows the complete tech stack and how components interact

**Skill Endorsement Workflow**: Detailed sequence of events when endorsing a skill

**Smart Contract Architecture**: Relationships between the three main contracts

**User Journey Map**: Different user flows for Admin, Employee, and Organization

**Data Flow Diagram**: How data moves through the system from user action to blockchain storage
