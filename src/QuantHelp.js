import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: ${props => props.theme.primary};
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  background: linear-gradient(45deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DropdownSection = styled.div`
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
    transform: translateY(-3px);
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: ${props => props.theme.secondaryBackground};
  cursor: pointer;
  transition: background-color 0.3s ease;

  h2 {
    margin: 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

const DropdownContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  padding: 20px;
  background-color: ${props => props.theme.background};
  animation: ${fadeIn} 0.3s ease-out;
`;

const SubsectionTitle = styled.h3`
  color: ${props => props.theme.primary};
  border-bottom: 2px solid ${props => props.theme.primary};
  padding-bottom: 10px;
  margin-top: 20px;
  margin-bottom: 15px;
`;

const MathFormula = styled.div`
  margin-bottom: 10px;
  padding: 12px 15px;
  background-color: ${props => props.theme.secondaryBackground};
  border-radius: 8px;
  line-height: 1.6;
  position: relative;
  transition: all 0.3s ease;

  &::before {
    content: '•';
    position: absolute;
    left: 5px;
    color: ${props => props.theme.primary};
    font-weight: bold;
  }

  &:hover {
    background-color: ${props => props.theme.hover};
    transform: translateX(5px);
  }
`;

const ToggleIcon = styled.span`
  transition: transform 0.3s ease;
  transform: rotate(${props => props.isOpen ? '180deg' : '0deg'});
  display: inline-block;
`;

const QuantHelp = () => {
    const [openSections, setOpenSections] = useState({
        geometry: false,
        arithmetic: false,
        algebra: false,
        probability: false,
        shortcuts: false,
        greQuant: false,
        testStrategies: false,
        dataInterpretation: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const quantSections = [
        {
            title: '📐 Geometry',
            key: 'geometry',
            content: [
                {
                    title: 'Polygons', formulas: [
                        'Sum of interior angles: (n-2) × 180°',
                        'Each interior angle (regular polygon): ((n-2) × 180°) / n',
                        'Exterior angle of a regular polygon: 360° / n'
                    ]
                },
                {
                    title: 'Circles', formulas: [
                        'Arc Length: (θ/360) × 2πr',
                        'Area of a Sector: (θ/360) × πr²',
                        'Circumference: 2πr',
                        'Circle Area: πr²'
                    ]
                },
                {
                    title: '3D Shapes', formulas: [
                        'Cylinder Volume: πr²h',
                        'Sphere Volume: (4/3)πr³',
                        'Cone Volume: (1/3)πr²h',
                        'Surface Area of Sphere: 4πr²',
                        'Surface Area of Cylinder: 2πrh + 2πr²'
                    ]
                },
                {
                    title: 'Triangle Formulas', formulas: [
                        'Area of Triangle: (1/2) × base × height',
                        'Pythagorean Theorem: a² + b² = c²',
                        'Area of Equilateral Triangle: (√3/4) × a²',
                        'Heron\'s Formula: √(s(s-a)(s-b)(s-c)), where s = (a+b+c)/2'
                    ]
                },
                {
                    title: 'Special Pythagorean Triples', formulas: [
                        'Common triples: (3, 4, 5)',
                        'More triples: (5, 12, 13)',
                        'Additional triples: (7, 24, 25)',
                        'Other known triple: (8, 15, 17)'
                    ]
                }
            ]
        },
        {
            title: '🔢 Arithmetic & Number Properties',
            key: 'arithmetic',
            content: [
                {
                    title: 'Divisibility Rules', formulas: [
                        'Divisible by 2: Last digit is even',
                        'Divisible by 3: Sum of digits divisible by 3',
                        'Divisible by 4: Last two digits divisible by 4',
                        'Divisible by 5: Last digit 0 or 5',
                        'Divisible by 6: Divisible by 2 and 3',
                        'Divisible by 9: Sum of digits divisible by 9',
                        'Divisible by 10: Ends in 0'
                    ]
                },
                {
                    title: 'Number Manipulation Tricks', formulas: [
                        'Multiplying by 11: For ab, result is a(a+b)b',
                        'Example: 23 × 11 = 2(2+3)3 = 253',
                        'Squaring Numbers Ending in 5: (x5)² = x × (x+1) followed by 25',
                        'Example: 25² = 2 × 3 = 6, so 625',
                        'Doubling and Halving: Simplify multiplication',
                        'Example: 25 × 16 = 50 × 8 = 400'
                    ]
                },
                {
                    title: 'Percentages', formulas: [
                        'Percent Change: ((New - Original) / Original) × 100%',
                        'Successive Percentage Changes: Apply sequentially',
                        'Percentage Increase: (Increase / Original) × 100%',
                        'Percentage Decrease: (Decrease / Original) × 100%'
                    ]
                }
            ]
        },
        {
            title: '📈 Algebra',
            key: 'algebra',
            content: [
                {
                    title: 'Algebraic Identities', formulas: [
                        'Difference of Squares: a² - b² = (a-b)(a+b)',
                        'Square of Sum: (a+b)² = a² + 2ab + b²',
                        'Square of Difference: (a-b)² = a² - 2ab + b²',
                        'Difference of Cubes: a³ - b³ = (a-b)(a²+ab+b²)',
                        'Sum of Cubes: a³ + b³ = (a+b)(a²-ab+b²)'
                    ]
                },
                {
                    title: 'Smart Numbers Technique', formulas: [
                        'Assign simple numbers to simplify calculations',
                        'For percentage problems, assume total is 100',
                        'Use 0, 1, 2 for initial algebraic simplification',
                        'Test boundary and extreme cases'
                    ]
                }
            ]
        },
        {
            title: '🎲 Probability & Combinatorics',
            key: 'probability',
            content: [
                {
                    title: 'Probability Basics', formulas: [
                        'Probability = Favorable Outcomes / Total Possible Outcomes',
                        'At Least One Probability: 1 - P(None)',
                        'Independent Events: P(A and B) = P(A) × P(B)',
                        'Mutually Exclusive Events: P(A or B) = P(A) + P(B)'
                    ]
                },
                {
                    title: 'Combinations & Permutations', formulas: [
                        'Combinations (order doesn\'t matter): C(n,r) = n! / (r! × (n-r)!)',
                        'Permutations (order matters): P(n,r) = n! / (n-r)!',
                        'Total Arrangements: n!',
                        'Probability of Specific Arrangement: 1 / Total Arrangements'
                    ]
                }
            ]
        },
        {
            title: '🧮 Data Interpretation',
            key: 'dataInterpretation',
            content: [
                {
                    title: 'Estimation Techniques', formulas: [
                        'Round numbers to simplify calculations',
                        'Adjust rounded values for precision',
                        'Use benchmark numbers for quick comparisons',
                        'Look for patterns in data sets'
                    ]
                },
                {
                    title: 'Calculation Shortcuts', formulas: [
                        'Percent Change: ((New - Original) / Original) × 100%',
                        'Use mental math for quick approximations',
                        'Break complex calculations into simpler steps',
                        'Verify results using alternative methods'
                    ]
                }
            ]
        }
    ];

    return (
        <PageContainer>
            <PageTitle>📚 GRE Quantitative Mastery Guide</PageTitle>
            {quantSections.map((section) => (
                <DropdownSection key={section.key}>
                    <DropdownHeader onClick={() => toggleSection(section.key)}>
                        <h2>{section.title}</h2>
                        <ToggleIcon isOpen={openSections[section.key]}>
                            {openSections[section.key] ? '▲' : '▼'}
                        </ToggleIcon>
                    </DropdownHeader>
                    <DropdownContent isOpen={openSections[section.key]}>
                        {section.content.map((subsection, index) => (
                            <div key={index}>
                                <SubsectionTitle>{subsection.title}</SubsectionTitle>
                                {subsection.formulas.map((formula, formulaIndex) => (
                                    <MathFormula key={formulaIndex}>
                                        {formula}
                                    </MathFormula>
                                ))}
                            </div>
                        ))}
                    </DropdownContent>
                </DropdownSection>
            ))}
        </PageContainer>
    );
};

export default QuantHelp; 