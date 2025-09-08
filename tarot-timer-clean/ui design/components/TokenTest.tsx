import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

/**
 * 🧪 Token Test Component
 * 
 * This component demonstrates the proper usage of design tokens
 * and serves as a testing ground for the token system.
 * 
 * All styling should use design tokens exclusively - no hardcoded values!
 */

interface TokenTestProps {}

export function TokenTest({}: TokenTestProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-surface-base)',
        padding: 'var(--space-l)'
      }}
    >
      {/* Header Section */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title and Theme Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="mb-2"
              style={{
                fontSize: 'var(--text-display-large)',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: 'var(--line-height-tight)',
                color: 'var(--color-text-primary)'
              }}
            >
              🎨 Design Token Test
            </h1>
            <p style={{
              fontSize: 'var(--text-body-large)',
              color: 'var(--color-text-secondary)'
            }}>
              Testing the complete design token system for Tarot Timer
            </p>
          </div>
          
          <Button 
            onClick={toggleTheme}
            style={{
              backgroundColor: 'var(--brand-accent)',
              color: 'var(--brand-primary)'
            }}
          >
            {isDarkMode ? '🌅 Light Mode' : '🌚 Dark Mode'}
          </Button>
        </div>

        {/* Color Tokens Test */}
        <Card className="bg-card border border-border shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle style={{ 
              fontSize: 'var(--text-title-medium)', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}>
              🌟 Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div 
                  className="h-16 w-full rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--brand-primary)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                ></div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-tertiary)'
                }}>Brand Primary</p>
                <code className="text-xs bg-muted p-1 rounded">#4A1A4F</code>
              </div>
              
              <div className="text-center space-y-2">
                <div 
                  className="h-16 w-full rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--brand-secondary)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                ></div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-tertiary)'
                }}>Brand Secondary</p>
                <code className="text-xs bg-muted p-1 rounded">#1A1F3A</code>
              </div>
              
              <div className="text-center space-y-2">
                <div 
                  className="h-16 w-full rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--brand-accent)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                ></div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-tertiary)'
                }}>Brand Accent</p>
                <code className="text-xs bg-muted p-1 rounded">#D4AF37</code>
              </div>
              
              <div className="text-center space-y-2">
                <div 
                  className="h-16 w-full border rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--brand-white)',
                    borderColor: 'var(--color-divider)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                ></div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-tertiary)'
                }}>Brand White</p>
                <code className="text-xs bg-muted p-1 rounded">#FFFFFF</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Test */}
        <Card className="bg-card border border-border shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle style={{ 
              fontSize: 'var(--text-title-medium)', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}>
              📝 Typography Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h1 style={{
                  fontSize: 'var(--text-display-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  lineHeight: 'var(--line-height-tight)',
                  color: 'var(--color-text-primary)'
                }}>Display Large - Hero Text</h1>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>32px / Semibold / 1.2 line-height</p>
              </div>
              
              <div>
                <h2 style={{
                  fontSize: 'var(--text-title-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  lineHeight: 'var(--line-height-normal)',
                  color: 'var(--color-text-primary)'
                }}>Title Large - Page Headers</h2>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>24px / Semibold / 1.3 line-height</p>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: 'var(--text-title-medium)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: 'var(--line-height-normal)',
                  color: 'var(--color-text-primary)'
                }}>Title Medium - Section Headers</h3>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>20px / Medium / 1.3 line-height</p>
              </div>
              
              <div>
                <h4 style={{
                  fontSize: 'var(--text-title-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--color-text-primary)'
                }}>Title Small - Card Headers</h4>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>18px / Medium / 1.4 line-height</p>
              </div>
              
              <div>
                <p style={{
                  fontSize: 'var(--text-body-large)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 'var(--line-height-loose)',
                  color: 'var(--color-text-primary)'
                }}>Body Large - Important content and descriptions</p>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>16px / Regular / 1.5 line-height</p>
              </div>
              
              <div>
                <p style={{
                  fontSize: 'var(--text-body-medium)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 'var(--line-height-loose)',
                  color: 'var(--foreground)'
                }}>Body Medium - Standard body text for most content</p>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>14px / Regular / 1.5 line-height</p>
              </div>
              
              <div>
                <p style={{
                  fontSize: 'var(--text-body-small)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--color-text-secondary)'
                }}>Body Small - Supporting text and descriptions</p>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>12px / Regular / 1.4 line-height</p>
              </div>
              
              <div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: 'var(--line-height-normal)',
                  color: 'var(--color-text-tertiary)'
                }}>Caption - Metadata and auxiliary information</p>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>11px / Medium / 1.3 line-height</p>
              </div>
              
              <div>
                <p style={{
                  fontSize: 'var(--text-overline)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: 'var(--line-height-normal)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent-primary)'
                }}>OVERLINE - LABELS AND CATEGORIES</p>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>10px / Medium / 1.3 line-height / Uppercase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacing Test */}
        <Card className="bg-card border border-border shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle style={{ 
              fontSize: 'var(--text-title-medium)', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}>
              📏 Spacing System (8pt Grid)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'XXS', token: 'space-xxs', size: '2px' },
                { name: 'XS', token: 'space-xs', size: '4px' },
                { name: 'S', token: 'space-s', size: '8px' },
                { name: 'M', token: 'space-m', size: '16px' },
                { name: 'L', token: 'space-l', size: '24px' },
                { name: 'XL', token: 'space-xl', size: '32px' },
                { name: 'XXL', token: 'space-xxl', size: '40px' },
                { name: 'XXXL', token: 'space-xxxl', size: '48px' },
              ].map((spacing) => (
                <div key={spacing.name} className="flex items-center gap-4">
                  <div 
                    className="w-16"
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-text-tertiary)'
                    }}
                  >
                    {spacing.name}
                  </div>
                  <div 
                    className="h-4"
                    style={{ 
                      width: spacing.size, 
                      backgroundColor: 'var(--brand-accent)'
                    }}
                  ></div>
                  <code 
                    className="bg-muted px-2 py-1 rounded"
                    style={{ fontSize: 'var(--text-caption)' }}
                  >
                    {spacing.size}
                  </code>
                  <span 
                    style={{
                      fontSize: 'var(--text-body-small)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    var(--{spacing.token})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Component Examples */}
        <Card className="bg-card border border-border shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle style={{ 
              fontSize: 'var(--text-title-medium)', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}>
              🛠️ Component Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Button Examples */}
            <div>
              <h4 
                className="mb-4"
                style={{
                  fontSize: 'var(--text-title-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Buttons
              </h4>
              <div className="flex flex-wrap gap-4">
                <Button style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--brand-white)'
                }}>
                  Primary Button
                </Button>
                <Button 
                  variant="outline" 
                  style={{
                    borderColor: 'var(--brand-primary)',
                    color: 'var(--brand-primary)'
                  }}
                >
                  Secondary Button  
                </Button>
                <Button style={{
                  backgroundColor: 'var(--brand-accent)',
                  color: 'var(--brand-primary)'
                }}>
                  Premium Button
                </Button>
              </div>
            </div>

            {/* Badge Examples */}
            <div>
              <h4 
                className="mb-4"
                style={{
                  fontSize: 'var(--text-title-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Badges
              </h4>
              <div className="flex flex-wrap gap-3">
                <Badge style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--brand-white)'
                }}>
                  Primary
                </Badge>
                <Badge style={{
                  backgroundColor: 'var(--brand-accent)',
                  color: 'var(--brand-primary)'
                }}>
                  Premium
                </Badge>
                <Badge 
                  variant="outline" 
                  style={{
                    borderColor: 'var(--brand-primary)',
                    color: 'var(--brand-primary)'
                  }}
                >
                  Outline
                </Badge>
                <Badge style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)'
                }}>
                  Muted
                </Badge>
              </div>
            </div>

            {/* Card Examples */}
            <div>
              <h4 
                className="mb-4"
                style={{
                  fontSize: 'var(--text-title-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Card Variants
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-card border border-border rounded-lg" style={{
                  boxShadow: 'var(--shadow-card)'
                }}>
                  <CardContent style={{ padding: 'var(--space-m)' }}>
                    <h5 
                      className="mb-2"
                      style={{
                        fontSize: 'var(--text-title-small)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      Mystical Card
                    </h5>
                    <p style={{
                      fontSize: 'var(--text-body-medium)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Standard card using design token shadows and spacing.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-2 rounded-lg" style={{
                  borderColor: 'var(--brand-accent)',
                  boxShadow: 'var(--shadow-elevated)'
                }}>
                  <CardContent style={{ padding: 'var(--space-m)' }}>
                    <h5 
                      className="mb-2"
                      style={{
                        fontSize: 'var(--text-title-small)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      Premium Card
                    </h5>
                    <p style={{
                      fontSize: 'var(--text-body-medium)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Premium card with accent border and elevated shadow.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Shadow & Effects Test */}
        <Card className="bg-card border border-border shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle style={{ 
              fontSize: 'var(--text-title-medium)', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}>
              ✨ Shadows & Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div 
                  className="h-24 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <span style={{
                    fontSize: 'var(--text-body-small)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Card Shadow
                  </span>
                </div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>
                  var(--shadow-card)
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div 
                  className="h-24 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    boxShadow: 'var(--shadow-elevated)'
                  }}
                >
                  <span style={{
                    fontSize: 'var(--text-body-small)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Elevated
                  </span>
                </div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>
                  var(--shadow-elevated)
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div 
                  className="h-24 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    boxShadow: 'var(--shadow-modal)'
                  }}
                >
                  <span style={{
                    fontSize: 'var(--text-body-small)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Modal
                  </span>
                </div>
                <p style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)'
                }}>
                  var(--shadow-modal)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Border Radius Test */}
        <Card className="bg-card border border-border shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle style={{ 
              fontSize: 'var(--text-title-medium)', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}>
              🔄 Border Radius Scale  
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Small', radius: 'var(--radius-small)', value: '4px' },
                { name: 'Medium', radius: 'var(--radius-medium)', value: '8px' },
                { name: 'Large', radius: 'var(--radius-large)', value: '16px' },
                { name: 'Full', radius: 'var(--radius-full)', value: '9999px' },
              ].map((radiusItem) => (
                <div key={radiusItem.name} className="text-center space-y-2">
                  <div 
                    className="h-16"
                    style={{
                      backgroundColor: 'var(--brand-accent)',
                      borderRadius: radiusItem.radius
                    }}
                  ></div>
                  <p style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)'
                  }}>
                    {radiusItem.name}
                  </p>
                  <code className="text-xs bg-muted p-1 rounded">
                    {radiusItem.value}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardContent style={{ padding: 'var(--space-m)' }}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <h3 
                  className="text-green-700 dark:text-green-300"
                  style={{
                    fontSize: 'var(--text-title-small)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  Design Token System: ACTIVE
                </h3>
                <p 
                  className="text-green-600 dark:text-green-400"
                  style={{
                    fontSize: 'var(--text-body-medium)'
                  }}
                >
                  All components are now using the centralized design token system. 
                  Ready for Step 2: Base Components.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}