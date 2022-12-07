import { Injectable } from '@angular/core';
import { Engine, Container } from "tsparticles-engine";
import { loadFull } from "tsparticles";

@Injectable({
    providedIn: 'root'
})

/**
 * This service controls the confetti effects for the application.
 * Confetti are triggered for successfull events that can be 
 * defined in the app. As of 11/08/2022 it's being used for 
 * two purposes, congratulating user for completing the 
 * navigation tour and congratulating user for upgrading
 * their account to premium.
 */
export class ConfettiService {

    constructor() { }

    shouldThrowParty: boolean = false;

    particleContainer: Container;

    /**
     * Various configuration options for the confetti effect.
     */
    particlesOptions = {
        fullScreen: {
            enable: true,
        },
        duration: 6000,
        detectRetina: true,
        responsive: [
            {
                maxWidth: 700,
                options: {
                    particles: {
                        move: {
                            speed: 30,
                            decay: 0.05
                        },
                    }
                }
            }
        ],
        emitters: [
            {
                direction: "top-right",
                rate: {
                    delay: 0.1,
                    quantity: 10
                },
                position: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            },
            {
                direction: "top-left",
                rate: {
                    delay: 0.1,
                    quantity: 10
                },
                position: {
                    x: 100,
                    y: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            }
        ],
        particles: {
            color: {
                value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"]
            },
            move: {
                decay: 0.05,
                direction: "none",
                enable: true,
                gravity: {
                    enable: true,
                    acceleration: 15
                },
                outModes: {
                    top: "none",
                    default: "destroy"
                },
                speed: { min: 25, max: 50 }
            },
            number: {
                value: 0
            },
            opacity: {
                value: 1,
                animation: {
                    enable: true,
                    minimumValue: 0,
                    speed: 2,
                    startValue: "max",
                    destroy: "min"
                }
            },
            rotate: {
                value: {
                    min: 0,
                    max: 360
                },
                direction: "random",
                animation: {
                    enable: true,
                    speed: 30
                }
            },
            tilt: {
                direction: "random",
                enable: true,
                value: {
                    min: 0,
                    max: 360
                },
                animation: {
                    enable: true,
                    speed: 30
                }
            },
            size: {
                value: 7,
                random: {
                    enable: true,
                    minimumValue: 3
                }
            },
            life: {
                duration: {
                    sync: true,
                    value: 5
                },
                count: 1
            },
            roll: {
                darken: {
                    enable: true,
                    value: 25
                },
                enable: true,
                speed: {
                    min: 5,
                    max: 15
                }
            },
            wobble: {
                distance: 50,
                enable: true,
                speed: {
                    min: -7,
                    max: 7
                }
            },
            shape: {
                type: [
                    "circle",
                    "square",
                    "polygon",
                    "image",
                ],
                options: {
                    image: [
                        {
                            src: "https://particles.js.org/images/fruits/apple.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/avocado.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/banana.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/berries.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/cherry.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/grapes.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/lemon.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/orange.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/peach.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/pear.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/pepper.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/plum.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/star.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/strawberry.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/watermelon.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        },
                        {
                            src: "https://particles.js.org/images/fruits/watermelon_slice.png",
                            width: 32,
                            height: 32,
                            particles: {
                                size: {
                                    value: 16
                                }
                            }
                        }
                    ],
                    polygon: [
                        {
                            sides: 5
                        },
                        {
                            sides: 6
                        }
                    ],
                }
            }
        }
    };

    /**
     * This function runs ater the particles have been loaded and provides
     * the information of the container in which the particles will be rendered.
     * @param container 
     */
    particlesLoaded(container: Container): void {
        this.particleContainer = container;
    }

    async particlesInit(engine: Engine): Promise<void> {
        await loadFull(engine);
    }
}