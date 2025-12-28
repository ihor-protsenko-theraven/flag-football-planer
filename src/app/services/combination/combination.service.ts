import {Injectable, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {
  Combination,
  CombinationCategory,
  CombinationComplexity,
  FirestoreCombination
} from '../../models/combination.model';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CombinationService {
  // Mock data store
  private combinations = signal<FirestoreCombination[]>([
    {
      id: '1',
      category: 'pass_play',
      complexity: 'basic',
      imageUrl: 'assets/images/combinations/spread_post.jpg',
      personnel: '5v5',
      formation: 'Spread',
      translations: {
        en: {
          name: 'Spread Post',
          description: 'Classic spacing concept with a primary post route by the X receiver.',
          keyPoints: ['QB reads safety movement', 'Z receiver runs a dig to clear space', 'Center holds block for 2 seconds then releases']
        },
        uk: {
          name: 'Спред Пост',
          description: 'Класична концепція з основним маршрутом пост від ресівера X.',
          keyPoints: ['Квотербек читає рух сейфті', 'Ресівер Z біжить dig, щоб звільнити простір', 'Центр тримає блок 2 секунди, потім виходить']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      category: 'run_play',
      complexity: 'basic',
      imageUrl: 'assets/images/combinations/run_basic.jpg',
      personnel: '5v5',
      formation: 'I-Formation',
      translations: {
        en: {
          name: 'Inside Zone Run',
          description: 'Direct handoff to the running back attacking the A-gap.',
          keyPoints: ['QB quick handoff decision', 'RB reads the Center\'s block', 'Receivers must block downfield']
        },
        uk: {
          name: 'Внутрішній забіг',
          description: 'Пряма передача раннінгбеку з атакою в проміжок A.',
          keyPoints: ['Швидке рішення квотербека про передачу', 'Раннінгбек читає блок центра', 'Ресівери повинні блокувати в глибині поля']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      category: 'trick_play',
      complexity: 'pro',
      imageUrl: 'assets/images/combinations/trick_reverse.jpg',
      personnel: '5v5',
      formation: 'Bunch',
      translations: {
        en: {
          name: 'Double Reverse Pass',
          description: 'High-risk, high-reward play involving multiple handoffs and a downfield pass.',
          keyPoints: ['First handoff must look like a sweep', 'QB clears out to flat', 'Final thrower must set feet']
        },
        uk: {
          name: 'Подвійний реверс пас',
          description: 'Ризикована комбінація з великим потенціалом, що включає кілька передач м\'яча та пас вперед.',
          keyPoints: ['Перша передача має виглядати як свіп', 'Квотербек йде у флет', 'Останній гравець з м\'ячем має закріпити позицію ніг']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      category: 'defense_scheme',
      complexity: 'basic',
      imageUrl: 'assets/images/combinations/cover_1.jpg',
      personnel: '5v5',
      formation: '3-1-1',
      translations: {
        en: {
          name: 'Cover 1 Man',
          description: 'Man-to-man coverage across the board with one deep safety.',
          keyPoints: ['Corners play inside leverage', 'Rusher must contain QB', 'Safety reads QB eyes']
        },
        uk: {
          name: 'Персональний захист Cover 1',
          description: 'Персональний захист проти всіх гравців з одним глибоким сейфті.',
          keyPoints: ['Корнери грають з внутрішньої сторони', 'Рашер повинен стримувати квотербека', 'Сейфті читає очі квотербека']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      category: 'pass_play',
      complexity: 'intermediate',
      imageUrl: 'assets/images/combinations/trips_flood.jpg',
      personnel: '5v5',
      formation: 'Trips Right',
      translations: {
        en: {
          name: 'Trips Flood',
          description: 'Overloads one side of the field with three receivers at different levels.',
          keyPoints: ['High-low read for QB', 'Deep route clears the corner', 'Short route holds the flat defender']
        },
        uk: {
          name: 'Перевантаження (Trips Flood)',
          description: 'Перевантаження однієї сторони поля трьома ресіверами на різних рівнях.',
          keyPoints: ['Квотербек читає захист зверху-вниз', 'Глибокий маршрут відтягує корнера', 'Короткий маршрут тримає захисника флету']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      category: 'defense_scheme',
      complexity: 'intermediate',
      imageUrl: 'assets/images/combinations/tampa_2.jpg',
      personnel: '5v5',
      formation: '2-1-2',
      translations: {
        en: {
          name: 'Tampa 2 Zone',
          description: 'Variation of Cover 2 where the rusher drops into deep middle coverage.',
          keyPoints: ['Corners aggressive in flats', 'Rusher covers deep middle hole', 'Safeties protect deep halves']
        },
        uk: {
          name: 'Зона Tampa 2',
          description: 'Варіація Cover 2, де рашер відходить у глибоку центральну зону.',
          keyPoints: ['Корнери агресивні у флетах', 'Рашер прикриває глибокий центр', 'Сейфті захищають глибокі половини']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '7',
      category: 'pass_play',
      complexity: 'basic',
      imageUrl: 'assets/images/combinations/slant_flat.jpg',
      personnel: '5v5',
      formation: 'Pro Set',
      translations: {
        en: {
          name: 'Slant Flat',
          description: 'Quick passing concept designed to stretch the flat defender horizontally.',
          keyPoints: ['Slant runner must be decisive', 'QB throws to the open window immediately', 'Flat route catches first']
        },
        uk: {
          name: 'Слент-Флет',
          description: 'Швидка пасова концепція, призначена для розтягування захисника флету по горизонталі.',
          keyPoints: ['Бігучий на сленті має бути рішучим', 'Квотербек кидає у відкрите вікно миттєво', 'Маршрут у флет ловить першим']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '8',
      category: 'run_play',
      complexity: 'basic',
      imageUrl: 'assets/images/combinations/jet_sweep.jpg',
      personnel: '5v5',
      formation: 'Spread',
      translations: {
        en: {
          name: 'Jet Sweep',
          description: 'Receiver goes in motion and takes a handoff at full speed.',
          keyPoints: ['Motion timing is critical', 'Snap ball just before WR passes QB', 'Center must block edge']
        },
        uk: {
          name: 'Джет Свіп',
          description: 'Ресівер починає рух та отримує м\'яч на повній швидкості.',
          keyPoints: ['Таймінг руху критичний', 'Снеп м\'яча безпосередньо перед тим, як ресівер мине квотербека', 'Центр має блокувати край']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '9',
      category: 'trick_play',
      complexity: 'pro',
      imageUrl: 'assets/images/combinations/flea_flicker.jpg',
      personnel: '5v5',
      formation: 'Single Back',
      translations: {
        en: {
          name: 'Flea Flicker',
          description: 'RB takes handoff, turns, and tosses ball back to QB for a deep pass.',
          keyPoints: ['Sell the run aggressively', 'QB must retreat for space', 'Receivers break deep late']
        },
        uk: {
          name: 'Флі-Флікер',
          description: 'Раннінгбек бере м\'яч, розвертається і кидає назад квотербеку для глибокого пасу.',
          keyPoints: ['Агресивно імітуйте біг', 'Квотербек має відступити для простору', 'Ресівери різко йдуть в глибину']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '10',
      category: 'defense_scheme',
      complexity: 'pro',
      imageUrl: 'assets/images/combinations/corner_blitz.jpg',
      personnel: '5v5',
      formation: '2-2-1',
      translations: {
        en: {
          name: 'Corner Blitz',
          description: 'Surprise pressure from the corner position while safety rotates over.',
          keyPoints: ['Corner must time the snap', 'Safety rotates to cover the void', 'Rusher plays coverage']
        },
        uk: {
          name: 'Бліц корнера',
          description: 'Несподіваний тиск з позиції корнера, поки сейфті зміщується.',
          keyPoints: ['Корнер має вгадати таймінг снепу', 'Сейфті зміщується, щоб закрити порожнечу', 'Рашер грає в прикритті']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '11',
      category: 'run_play',
      complexity: 'pro',
      imageUrl: 'assets/images/combinations/rpo_read.jpg',
      personnel: '5v5',
      formation: 'Spread',
      translations: {
        en: {
          name: 'RPO Zone Read',
          description: 'Run-Pass Option where QB reads the specific defender to decide.',
          keyPoints: ['QB reads defensive end/blitzer', 'RB runs hard regardless', 'WR runs barrier screen']
        },
        uk: {
          name: 'RPO Zone Read',
          description: 'Опція біг-пас, де квотербек читає конкретного захисника для прийняття рішення.',
          keyPoints: ['Квотербек читає еджа або бліцера', 'Раннінгбек біжить жорстко в будь-якому випадку', 'Ресівер виконує скрін-бар\'єр']
        }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '12',
      category: 'pass_play',
      complexity: 'intermediate',
      imageUrl: 'assets/images/combinations/stack_go.jpg',
      personnel: '5v5',
      formation: 'Twins Stack',
      translations: {
        en: {
          name: 'Stack Go',
          description: 'Stacked receivers confuse coverage, back receiver fakes out and goes deep.',
          keyPoints: ['Front receiver blocks or runs short', 'Back receiver hesitates then accelerates', 'Good against man coverage']
        },
        uk: {
          name: 'Стек (Маршрут Go)',
          description: 'Ресівери в стеку заплутують захист, задній ресівер робить фейк і біжить в глибину.',
          keyPoints: ['Передній ресівер блокує або біжить коротко', 'Задній ресівер вагається, потім прискорюється', 'Ефективно проти персонального захисту']
        }
      },
      createdAt: new Date().toISOString()
    }
  ]);

  constructor(private translate: TranslateService) {
  }

  getCombinations(): Observable<Combination[]> {
    // Simulate API delay and flattening
    return of(this.flattenCombinations(this.combinations())).pipe(delay(500));
  }

  filterAndSearchCombinations(term?: string, category?: CombinationCategory, complexity?: CombinationComplexity, personnel?: string): Combination[] {
    let result = this.flattenCombinations(this.combinations());
    const query = term?.toLowerCase().trim();

    return result.filter(c => {
      const matchSearch = !query || c.name.toLowerCase().includes(query) || (c.description && c.description.toLowerCase().includes(query));
      const matchCategory = !category || c.category === category;
      const matchComplexity = !complexity || c.complexity === complexity;
      const matchPersonnel = !personnel || c.personnel === personnel;

      return matchSearch && matchCategory && matchComplexity && matchPersonnel;
    });
  }

  private flattenCombinations(items: FirestoreCombination[]): Combination[] {
    const lang = this.translate.currentLang === 'uk' ? 'uk' : 'en';
    return items.map(item => {
      const t = item.translations[lang] || item.translations['en'];
      return {
        id: item.id,
        category: item.category,
        complexity: item.complexity,
        imageUrl: item.imageUrl,
        personnel: item.personnel,
        formation: item.formation,
        relatedDrillIds: item.relatedDrillIds,
        name: t.name,
        description: t.description,
        keyPoints: t.keyPoints
      };
    });
  }

  getCombinationById(id: string): Observable<Combination | null> {
    return of(this.flattenCombinations(this.combinations()).find(c => c.id === id) || null).pipe(delay(300));
  }
}
