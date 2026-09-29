
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'Tally',
        slug: "tally",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },

  }


  options = {
    base: "https://www.logwithtally.com/api/v1",

    auth: {
      prefix: 'Bearer',
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        feed: {
        },
  
        food_entry: {
        },
  
        mood_entry: {
        },
  
        sleep_log: {
        },
  
        workout_log: {
        },
  
    }
  }


  entity = {
    "feed": {
      "fields": [
        {
          "name": "date",
          "title": "Date",
          "type": "`$STRING`",
          "format": "date"
        },
        {
          "name": "items",
          "title": "Items",
          "type": "`$ARRAY`"
        },
        {
          "name": "relative_label",
          "title": "Relative Label",
          "type": "`$STRING`",
          "short": "\"Today\", \"Yesterday\", or the weekday name"
        }
      ],
      "name": "feed",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/feed",
              "segments": [
                {
                  "lit": "feed"
                }
              ],
              "parts": [
                "feed"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.days`"
              },
              "args": {
                "query": [
                  {
                    "name": "before",
                    "orig": "before",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "2026-06-03"
                  }
                ]
              },
              "select": {
                "exist": [
                  "before"
                ]
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "food_entry": {
      "fields": [
        {
          "name": "caffeine_mg",
          "title": "Caffeine Mg",
          "type": "`$INTEGER`"
        },
        {
          "name": "calories",
          "title": "Calories",
          "type": "`$INTEGER`"
        },
        {
          "name": "carbs_g",
          "title": "Carbs G",
          "type": "`$NUMBER`"
        },
        {
          "name": "confirmed",
          "title": "Confirmed",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "date",
          "title": "Date",
          "type": "`$STRING`",
          "short": "Date to log against (YYYY-MM-DD).",
          "format": "date"
        },
        {
          "name": "entry",
          "title": "Entry",
          "type": "`$OBJECT`"
        },
        {
          "name": "fat_g",
          "title": "Fat G",
          "type": "`$NUMBER`"
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$INTEGER`"
        },
        {
          "name": "input",
          "title": "Input",
          "type": "`$STRING`",
          "req": true,
          "short": "Natural-language food description, e.g."
        },
        {
          "name": "logged_on",
          "title": "Logged On",
          "type": "`$STRING`",
          "format": "date"
        },
        {
          "name": "meal_type",
          "title": "Meal Type",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`"
        },
        {
          "name": "protein_g",
          "title": "Protein G",
          "type": "`$NUMBER`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "food_entry",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/food_entries",
              "segments": [
                {
                  "lit": "food_entries"
                }
              ],
              "parts": [
                "food_entries"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            },
            {
              "kind": "http",
              "method": "POST",
              "orig": "/food_entries/parse",
              "segments": [
                {
                  "lit": "food_entries"
                },
                {
                  "lit": "parse"
                }
              ],
              "parts": [
                "food_entries",
                "parse"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {
                "$action": "parse"
              }
            }
          ]
        },
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/food_entries",
              "segments": [
                {
                  "lit": "food_entries"
                }
              ],
              "parts": [
                "food_entries"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.entries`"
              },
              "args": {
                "query": [
                  {
                    "name": "date",
                    "orig": "date",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "2026-06-03"
                  }
                ]
              },
              "select": {
                "exist": [
                  "date"
                ]
              }
            }
          ]
        },
        "remove": {
          "input": "data",
          "name": "remove",
          "points": [
            {
              "kind": "http",
              "method": "DELETE",
              "orig": "/food_entries/{id}",
              "segments": [
                {
                  "lit": "food_entries"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "food_entries",
                "{id}"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "id",
                    "type": "`$INTEGER`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              }
            }
          ]
        },
        "update": {
          "input": "data",
          "name": "update",
          "points": [
            {
              "kind": "http",
              "method": "PATCH",
              "orig": "/food_entries/{id}",
              "segments": [
                {
                  "lit": "food_entries"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "food_entries",
                "{id}"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "id",
                    "type": "`$INTEGER`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "mood_entry": {
      "fields": [
        {
          "name": "body",
          "title": "Body",
          "type": "`$STRING`",
          "req": true,
          "op": {
            "list": {
              "type": "`$STRING`"
            }
          }
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$INTEGER`"
        },
        {
          "name": "logged_at",
          "title": "Logged At",
          "type": "`$STRING`",
          "short": "ISO 8601 timestamp.",
          "format": "date-time"
        },
        {
          "name": "time_label",
          "title": "Time Label",
          "type": "`$STRING`",
          "short": "Human-readable local time"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "mood_entry",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/mood_entries",
              "segments": [
                {
                  "lit": "mood_entries"
                }
              ],
              "parts": [
                "mood_entries"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            }
          ]
        },
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/mood_entries",
              "segments": [
                {
                  "lit": "mood_entries"
                }
              ],
              "parts": [
                "mood_entries"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.entries`"
              },
              "args": {
                "query": [
                  {
                    "name": "date",
                    "orig": "date",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "2026-06-03"
                  }
                ]
              },
              "select": {
                "exist": [
                  "date"
                ]
              }
            }
          ]
        },
        "remove": {
          "input": "data",
          "name": "remove",
          "points": [
            {
              "kind": "http",
              "method": "DELETE",
              "orig": "/mood_entries/{id}",
              "segments": [
                {
                  "lit": "mood_entries"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "mood_entries",
                "{id}"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "id",
                    "type": "`$INTEGER`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "sleep_log": {
      "fields": [
        {
          "name": "awake_seconds",
          "title": "Awake Seconds",
          "type": "`$INTEGER`"
        },
        {
          "name": "date",
          "title": "Date",
          "type": "`$STRING`",
          "format": "date"
        },
        {
          "name": "deep_sleep_seconds",
          "title": "Deep Sleep Seconds",
          "type": "`$INTEGER`"
        },
        {
          "name": "duration_label",
          "title": "Duration Label",
          "type": "`$STRING`",
          "short": "Human-friendly duration, e.g."
        },
        {
          "name": "ended_at",
          "title": "Ended At",
          "type": "`$STRING`",
          "format": "date-time"
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$INTEGER`"
        },
        {
          "name": "light_sleep_seconds",
          "title": "Light Sleep Seconds",
          "type": "`$INTEGER`"
        },
        {
          "name": "rem_sleep_seconds",
          "title": "Rem Sleep Seconds",
          "type": "`$INTEGER`"
        },
        {
          "name": "sleep_score",
          "title": "Sleep Score",
          "type": "`$INTEGER`"
        },
        {
          "name": "source",
          "title": "Source",
          "type": "`$STRING`"
        },
        {
          "name": "started_at",
          "title": "Started At",
          "type": "`$STRING`",
          "format": "date-time"
        },
        {
          "name": "total_sleep_seconds",
          "title": "Total Sleep Seconds",
          "type": "`$INTEGER`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "sleep_log",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/sleep_logs",
              "segments": [
                {
                  "lit": "sleep_logs"
                }
              ],
              "parts": [
                "sleep_logs"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.sleep_logs`"
              },
              "args": {
                "query": [
                  {
                    "name": "date",
                    "orig": "date",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "2026-06-03"
                  }
                ]
              },
              "select": {
                "exist": [
                  "date"
                ]
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "workout_log": {
      "fields": [
        {
          "name": "activity_type",
          "title": "Activity Type",
          "type": "`$STRING`"
        },
        {
          "name": "calories",
          "title": "Calories",
          "type": "`$INTEGER`"
        },
        {
          "name": "distance_m",
          "title": "Distance M",
          "type": "`$INTEGER`",
          "short": "Distance in metres"
        },
        {
          "name": "distance_miles",
          "title": "Distance Miles",
          "type": "`$NUMBER`",
          "short": "Distance in miles (rounded to 1 decimal)"
        },
        {
          "name": "duration_label",
          "title": "Duration Label",
          "type": "`$STRING`",
          "short": "Human-friendly duration, e.g."
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$INTEGER`"
        },
        {
          "name": "logged_on",
          "title": "Logged On",
          "type": "`$STRING`",
          "format": "date"
        },
        {
          "name": "moving_time_s",
          "title": "Moving Time S",
          "type": "`$INTEGER`",
          "short": "Moving time in seconds"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`"
        },
        {
          "name": "occurred_at",
          "title": "Occurred At",
          "type": "`$STRING`",
          "format": "date-time"
        },
        {
          "name": "source",
          "title": "Source",
          "type": "`$STRING`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "workout_log",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/workout_logs",
              "segments": [
                {
                  "lit": "workout_logs"
                }
              ],
              "parts": [
                "workout_logs"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.workouts`"
              },
              "args": {
                "query": [
                  {
                    "name": "date",
                    "orig": "date",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "2026-06-03"
                  }
                ]
              },
              "select": {
                "exist": [
                  "date"
                ]
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

