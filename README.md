<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vita Romana - Interactive Ancient Rome Experience</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Lato:wght@300;400;700&display=swap');
        
        body { margin: 0; overflow: hidden; background: #000; font-family: 'Lato', sans-serif; }
        
        .roman-font { font-family: 'Cinzel', serif; }
        
        #game-container { position: relative; width: 100vw; height: 100vh; }
        
        /* UI Overlay Styles */
        .ui-layer { position: absolute; pointer-events: none; width: 100%; height: 100%; }
        .interactive { pointer-events: auto; }
        
        /* Dialogue Box */
        #dialogue-box {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 800px;
            background: linear-gradient(to bottom, rgba(20, 10, 5, 0.95), rgba(10, 5, 0, 0.98));
            border: 3px solid #d4af37;
            border-radius: 10px;
            padding: 20px;
            color: #f4e4c1;
            display: none;
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.3), inset 0 0 50px rgba(0,0,0,0.5);
        }
        
        .character-portrait {
            width: 80px;
            height: 80px;
            border: 2px solid #d4af37;
            border-radius: 50%;
            background: #2a1810;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2em;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .friendship-bar {
            height: 6px;
            background: #333;
            border-radius: 3px;
            overflow: hidden;
            margin-top: 5px;
            width: 100px;
        }
        
        .friendship-fill {
            height: 100%;
            background: linear-gradient(to right, #ff4444, #ffaa00, #44ff44);
            transition: width 0.5s ease;
        }
        
        .dialogue-option {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid #d4af37;
            padding: 10px 15px;
            margin: 5px 0;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 5px;
        }
        
        .dialogue-option:hover {
            background: rgba(212, 175, 55, 0.3);
            transform: translateX(10px);
        }
        
        /* Stats Panel */
        #stats-panel {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(20, 10, 5, 0.9);
            border: 2px solid #d4af37;
            padding: 15px;
            border-radius: 10px;
            color: #d4af37;
            min-width: 200px;
        }
        
        /* Location Indicator */
        #location-indicator {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(20, 10, 5, 0.9);
            border: 2px solid #d4af37;
            padding: 10px 20px;
            border-radius: 5px;
            color: #d4af37;
            font-size: 1.2em;
        }
        
        /* Interaction Prompt */
        #interaction-prompt {
            position: absolute;
            bottom: 200px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(212, 175, 55, 0.9);
            color: #000;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            display: none;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.1); }
        }
        
        /* Loading Screen */
        #loading {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #0a0500;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: #d4af37;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #d4af37;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Menu Screen */
        #main-menu {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #1a0f0a 0%, #0a0500 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
        }
        
        .menu-title {
            font-size: 4em;
            color: #d4af37;
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
            margin-bottom: 10px;
            letter-spacing: 0.1em;
        }
        
        .menu-subtitle {
            font-size: 1.2em;
            color: #8b7355;
            margin-bottom: 50px;
            font-style: italic;
        }
        
        .menu-button {
            background: transparent;
            border: 2px solid #d4af37;
            color: #d4af37;
            padding: 15px 40px;
            font-size: 1.2em;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s;
            font-family: 'Cinzel', serif;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .menu-button:hover {
            background: #d4af37;
            color: #0a0500;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }
        
        /* Gladiator Game Overlay */
        #gladiator-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        
        .arena-text {
            font-size: 3em;
            color: #ff4444;
            text-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
            margin-bottom: 20px;
        }
        
        /* Crosshair */
        #crosshair {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 20px; height: 20px;
            border: 2px solid rgba(212, 175, 55, 0.6);
            border-radius: 50%;
            pointer-events: none;
        }
        
        #crosshair::after {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 4px; height: 4px;
            background: #d4af37;
            border-radius: 50%;
        }
        
        /* Notification */
        .notification {
            position: absolute;
            top: 100px;
            right: 20px;
            background: rgba(212, 175, 55, 0.9);
            color: #000;
            padding: 15px;
            border-radius: 5px;
            transform: translateX(400px);
            transition: transform 0.5s ease;
            max-width: 300px;
        }
        
        .notification.show { transform: translateX(0); }
        
        /* Scrollbar for dialogue */
        .dialogue-text::-webkit-scrollbar { width: 8px; }
        .dialogue-text::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .dialogue-text::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 4px; }
    </style>
</head>
<body>
    <div id="game-container">
        <!-- 3D Canvas -->
        <canvas id="game-canvas"></canvas>
        
        <!-- Loading Screen -->
        <div id="loading">
            <div class="loading-spinner"></div>
            <div class="roman-font text-2xl">Building Ancient Rome...</div>
        </div>
        
        <!-- Main Menu -->
        <div id="main-menu" class="interactive">
            <h1 class="menu-title roman-font">VITA ROMANA</h1>
            <p class="menu-subtitle">Experience Life in Ancient Rome</p>
            <button class="menu-button" onclick="startGame()">Enter the Eternal City</button>
            <button class="menu-button" onclick="showInstructions()">How to Play</button>
        </div>
        
        <!-- Instructions Modal -->
        <div id="instructions" class="hidden absolute inset-0 bg-black/90 z-50 flex items-center justify-center interactive">
            <div class="bg-gradient-to-b from-amber-900/20 to-black border-2 border-amber-600 p-8 rounded-lg max-w-2xl text-amber-100">
                <h2 class="roman-font text-3xl mb-4 text-amber-400">How to Play</h2>
                <ul class="space-y-2 mb-6">
                    <li><strong>WASD</strong> - Move around the city</li>
                    <li><strong>Mouse</strong> - Look around</li>
                    <li><strong>E</strong> - Interact with characters</li>
                    <li><strong>ESC</strong> - Release mouse cursor</li>
                </ul>
                <p class="mb-4">Explore the Forum, interact with citizens from all social classes, build friendships through dialogue choices, and attend gladiatorial games at the Colosseum.</p>
                <button class="menu-button" onclick="hideInstructions()">Return to Menu</button>
            </div>
        </div>
        
        <!-- HUD -->
        <div id="ui-layer" class="ui-layer hidden">
            <div id="location-indicator" class="roman-font">
                <span id="current-location">The Forum Romanum</span>
            </div>
            
            <div id="stats-panel">
                <div class="roman-font text-lg mb-2 border-b border-amber-600 pb-1">Status</div>
                <div class="flex justify-between mb-1"><span>Reputation:</span><span id="rep-value">Neutral</span></div>
                <div class="flex justify-between mb-1"><span>Denarii:</span><span id="money-value">50</span></div>
                <div class="flex justify-between"><span>Friends:</span><span id="friends-count">0</span></div>
            </div>
            
            <div id="crosshair"></div>
            <div id="interaction-prompt" class="interactive">Press E to Talk</div>
            
            <!-- Dialogue Box -->
            <div id="dialogue-box" class="interactive">
                <div class="flex items-start mb-4">
                    <div class="character-portrait" id="speaker-portrait">👤</div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="roman-font text-xl text-amber-400" id="speaker-name">Unknown</h3>
                            <div class="text-xs text-gray-400" id="speaker-class">Plebeian</div>
                        </div>
                        <div class="friendship-bar">
                            <div class="friendship-fill" id="friendship-bar" style="width: 50%"></div>
                        </div>
                        <div class="text-xs text-gray-400 mt-1" id="friendship-text">Neutral</div>
                    </div>
                </div>
                <div class="dialogue-text text-lg mb-4 leading-relaxed max-h-32 overflow-y-auto" id="dialogue-text">
                    Welcome to Rome, traveler.
                </div>
                <div id="dialogue-options" class="space-y-2">
                    <!-- Options injected via JS -->
                </div>
                <button onclick="closeDialogue()" class="absolute top-2 right-2 text-amber-600 hover:text-amber-400 text-xl">&times;</button>
            </div>
            
            <!-- Gladiator Overlay -->
            <div id="gladiator-overlay" class="interactive">
                <div class="arena-text roman-font">MUNERA GLADIATORIA</div>
                <div class="text-amber-200 text-xl mb-8 text-center max-w-2xl">
                    You take your seat among the roaring crowd. The sand is red with blood.<br>
                    <span class="text-sm text-gray-400">Press ESC to leave the games</span>
                </div>
                <div class="grid grid-cols-3 gap-4 max-w-3xl w-full px-4">
                    <div class="bg-red-900/30 border border-red-600 p-4 rounded text-center">
                        <div class="text-2xl mb-2">⚔️</div>
                        <div class="text-red-400 font-bold">Murmillo</div>
                        <div class="text-xs text-gray-400">Heavy infantry style</div>
                    </div>
                    <div class="bg-red-900/30 border border-red-600 p-4 rounded text-center">
                        <div class="text-2xl mb-2">🛡️</div>
                        <div class="text-red-400 font-bold">Retiarius</div>
                        <div class="text-xs text-gray-400">Net and trident</div>
                    </div>
                    <div class="bg-red-900/30 border border-red-600 p-4 rounded text-center">
                        <div class="text-2xl mb-2">🏹</div>
                        <div class="text-red-400 font-bold">Sagittarius</div>
                        <div class="text-xs text-gray-400">Archer specialist</div>
                    </div>
                </div>
                <div class="mt-8 text-amber-600 animate-pulse">The crowd roars for blood...</div>
            </div>
        </div>
        
        <!-- Notification Container -->
        <div id="notification-container" class="absolute top-20 right-0 pointer-events-none"></div>
    </div>

    <script>
        // Game State
        const gameState = {
            currentLocation: 'forum',
            reputation: 50, // 0-100
            money: 50,
            friendships: {},
            inDialogue: false,
            currentNPC: null,
            gladiatorMode: false
        };

        // NPC Database with historically accurate Roman social classes
        const npcDatabase = {
            'forum': [
                {
                    id: 'senator_marcus',
                    name: 'Senator Marcus Aurelius',
                    class: 'Patrician',
                    icon: '🏛️',
                    position: { x: 5, z: 5 },
                    color: 0x8B0000,
                    friendship: 30,
                    dialogues: {
                        greeting: "Greetings. I am Marcus, serving in the Senate. You appear to be new to the Forum.",
                        topics: {
                            politics: {
                                text: "The Republic faces grave challenges. Pompey grows too ambitious, yet Caesar threatens our traditions.",
                                options: [
                                    { text: "Caesar understands the people's needs.", effect: -10, response: "The people? The mob? *scoffs* We are not ruled by popularity contests." },
                                    { text: "The Senate must preserve Roman virtue.", effect: 15, response: "Exactly! Dignitas and auctoritas must guide us, not demagogues." },
                                    { text: "What of the common citizens?", effect: -5, response: "They have their bread and circuses. We provide order." }
                                ]
                            },
                            daily_life: {
                                text: "My day begins with salutatio - receiving clients at dawn. Then the Senate meets, though much is mere debate.",
                                options: [
                                    { text: "Tell me of your clients.", effect: 5, response: "Ah, the clientela system. They seek my patronage, I offer protection. It is the Roman way." },
                                    { text: "Do you ever visit the Subura?", effect: -15, response: "The slums? *looks disgusted* I have people for such errands." }
                                ]
                            },
                            games: {
                                text: "The munera gladiatoria are necessary. They remind the people of Rome's martial virtues... and keep them docile.",
                                options: [
                                    { text: "I wish to attend the games.", effect: 10, response: "Then you shall. Mention my name at the Colosseum gate. I sponsor today's matches.", action: 'unlock_games' },
                                    { text: "The games seem brutal.", effect: -10, response: "Brutal? They are civilization. Barbarians kill without purpose. We kill as art." }
                                ]
                            }
                        }
                    }
                },
                {
                    id: 'pleb_lucius',
                    name: 'Lucius the Baker',
                    class: 'Plebeian',
                    icon: '🍞',
                    position: { x: -8, z: 3 },
                    color: 0x8B4513,
                    friendship: 50,
                    dialogues: {
                        greeting: "Salve! Fresh bread from the oven! Though the grain dole lines grow longer each day.",
                        topics: {
                            work: {
                                text: "Up before dawn to knead dough. The insulae catch fire if you're not careful with the ovens.",
                                options: [
                                    { text: "Tell me of the grain dole.", effect: 5, response: "Free bread from the state! 200,000 of us in Rome depend on it. Better than starving." },
                                    { text: "Do you own your shop?", effect: -5, response: "Own? *laughs bitterly* I rent from a patrician. Half my earnings go to his purse." },
                                    { text: "The fires are dangerous?", effect: 10, response: "Last month, three insulae collapsed in the Subura. We live like rats in a burning woodpile." }
                                ]
                            },
                            family: {
                                text: "My wife works the loom, my son delivers bread. We survive. That's more than many can say.",
                                options: [
                                    { text: "Your son could join the legions.", effect: 15, response: "Yes! Marius opened the army to us capite censi. Twenty years service, and we get land!" },
                                    { text: "Is life hard in the Subura?", effect: 5, response: "Hard? It's filthy, crowded, and the rent collectors are thieves. But we have each other." }
                                ]
                            },
                            politics: {
                                text: "Politics? I have no vote in the Comitia, but the tribunes speak for us... sometimes.",
                                options: [
                                    { text: "The tribunes protect the plebs.", effect: 10, response: "Clodius now, he throws wild feasts and fights for our grain. He's a rascal, but OUR rascal." },
                                    { text: "Do you trust the Senate?", effect: -10, response: "Those greedy bloodsuckers? They'd tax the air we breathe if they could find a way." }
                                ]
                            }
                        }
                    }
                },
                {
                    id: 'freedman_gaius',
                    name: 'Gaius
