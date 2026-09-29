// Generated runtime schemas from the same OpenAPI source as TallyApiTypes.
import type { ContractSchema } from './ApiValidation'

export const schemas = {
  "ListFoodEntriesQuery": {
    "type": "object",
    "required": [],
    "properties": {
      "date": {
        "type": "string"
      }
    }
  },
  "ListFoodEntriesResponse": {
    "type": "object",
    "properties": {
      "date": {
        "type": "string"
      },
      "entries": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "caffeine_mg": {
              "type": "integer"
            },
            "calories": {
              "type": "integer"
            },
            "carbs_g": {
              "type": "number"
            },
            "confirmed": {
              "type": "boolean"
            },
            "fat_g": {
              "type": "number"
            },
            "id": {
              "type": "integer"
            },
            "logged_on": {
              "type": "string"
            },
            "meal_type": {
              "type": "string",
              "enum": [
                "breakfast",
                "lunch",
                "dinner",
                "snack"
              ]
            },
            "name": {
              "type": "string"
            },
            "protein_g": {
              "type": "number"
            }
          }
        }
      },
      "totals": {
        "type": "object",
        "properties": {
          "caffeine_mg": {
            "type": "integer"
          },
          "calories": {
            "type": "integer"
          },
          "carbs_g": {
            "type": "number"
          },
          "entry_count": {
            "type": "integer"
          },
          "fat_g": {
            "type": "number"
          },
          "protein_g": {
            "type": "number"
          }
        }
      },
      "remaining": {
        "type": "object",
        "properties": {
          "calories": {
            "type": "integer"
          },
          "carbs_g": {
            "type": "number"
          },
          "fat_g": {
            "type": "number"
          },
          "protein_g": {
            "type": "number"
          }
        }
      },
      "goals": {
        "type": "object",
        "nullable": true,
        "properties": {
          "calories": {
            "type": "integer"
          },
          "carbs_g": {
            "type": "number"
          },
          "fat_g": {
            "type": "number"
          },
          "protein_g": {
            "type": "number"
          }
        }
      }
    }
  },
  "CreateFoodEntriesBody": {
    "type": "object",
    "required": [
      "input"
    ],
    "properties": {
      "input": {
        "type": "string"
      },
      "meal_type": {
        "type": "string",
        "enum": [
          "breakfast",
          "lunch",
          "dinner",
          "snack"
        ]
      },
      "date": {
        "type": "string"
      }
    }
  },
  "CreateFoodEntriesResponse": {
    "type": "object",
    "properties": {
      "entries": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            },
            "meal_type": {
              "type": "string",
              "enum": [
                "breakfast",
                "lunch",
                "dinner",
                "snack"
              ]
            },
            "logged_on": {
              "type": "string"
            },
            "calories": {
              "type": "integer"
            },
            "protein_g": {
              "type": "number"
            },
            "carbs_g": {
              "type": "number"
            },
            "fat_g": {
              "type": "number"
            },
            "caffeine_mg": {
              "type": "integer"
            },
            "confirmed": {
              "type": "boolean"
            }
          }
        }
      },
      "totals": {
        "type": "object",
        "properties": {
          "calories": {
            "type": "integer"
          },
          "protein_g": {
            "type": "number"
          },
          "carbs_g": {
            "type": "number"
          },
          "fat_g": {
            "type": "number"
          },
          "caffeine_mg": {
            "type": "integer"
          },
          "entry_count": {
            "type": "integer"
          }
        }
      },
      "remaining": {
        "type": "object",
        "properties": {
          "calories": {
            "type": "integer"
          },
          "protein_g": {
            "type": "number"
          },
          "carbs_g": {
            "type": "number"
          },
          "fat_g": {
            "type": "number"
          }
        }
      }
    }
  },
  "ParseFoodEntriesBody": {
    "type": "object",
    "required": [
      "input"
    ],
    "properties": {
      "input": {
        "type": "string"
      },
      "meal_type": {
        "type": "string",
        "enum": [
          "breakfast",
          "lunch",
          "dinner",
          "snack"
        ]
      }
    }
  },
  "ParseFoodEntriesResponse": {
    "type": "object",
    "properties": {
      "raw_input": {
        "type": "string"
      },
      "meal_type": {
        "type": "string",
        "enum": [
          "breakfast",
          "lunch",
          "dinner",
          "snack"
        ]
      },
      "parsed": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "calories": {
              "type": "integer"
            },
            "protein_g": {
              "type": "number"
            },
            "carbs_g": {
              "type": "number"
            },
            "fat_g": {
              "type": "number"
            },
            "caffeine_mg": {
              "type": "integer"
            }
          }
        }
      }
    }
  },
  "UpdateFoodEntryId": {
    "type": "integer"
  },
  "UpdateFoodEntryBody": {
    "type": "object",
    "properties": {
      "entry": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "calories": {
            "type": "integer"
          },
          "protein_g": {
            "type": "number"
          },
          "carbs_g": {
            "type": "number"
          },
          "fat_g": {
            "type": "number"
          },
          "caffeine_mg": {
            "type": "integer"
          },
          "meal_type": {
            "type": "string",
            "enum": [
              "breakfast",
              "lunch",
              "dinner",
              "snack"
            ]
          }
        }
      }
    }
  },
  "UpdateFoodEntryResponse": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "name": {
        "type": "string"
      },
      "meal_type": {
        "type": "string",
        "enum": [
          "breakfast",
          "lunch",
          "dinner",
          "snack"
        ]
      },
      "logged_on": {
        "type": "string"
      },
      "calories": {
        "type": "integer"
      },
      "protein_g": {
        "type": "number"
      },
      "carbs_g": {
        "type": "number"
      },
      "fat_g": {
        "type": "number"
      },
      "caffeine_mg": {
        "type": "integer"
      },
      "confirmed": {
        "type": "boolean"
      }
    }
  },
  "DeleteFoodEntryId": {
    "type": "integer"
  },
  "DeleteFoodEntryResponse": {
    "type": "object",
    "properties": {
      "message": {
        "type": "string"
      },
      "totals": {
        "type": "object",
        "properties": {
          "calories": {
            "type": "integer"
          },
          "protein_g": {
            "type": "number"
          },
          "carbs_g": {
            "type": "number"
          },
          "fat_g": {
            "type": "number"
          },
          "caffeine_mg": {
            "type": "integer"
          },
          "entry_count": {
            "type": "integer"
          }
        }
      },
      "remaining": {
        "type": "object",
        "properties": {
          "calories": {
            "type": "integer"
          },
          "protein_g": {
            "type": "number"
          },
          "carbs_g": {
            "type": "number"
          },
          "fat_g": {
            "type": "number"
          }
        }
      }
    }
  },
  "ListMoodEntriesQuery": {
    "type": "object",
    "required": [],
    "properties": {
      "date": {
        "type": "string"
      }
    }
  },
  "ListMoodEntriesResponse": {
    "type": "object",
    "properties": {
      "entries": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "body": {
              "type": "string"
            },
            "id": {
              "type": "integer"
            },
            "logged_at": {
              "type": "string"
            },
            "time_label": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "CreateMoodEntryBody": {
    "type": "object",
    "required": [
      "body"
    ],
    "properties": {
      "body": {
        "type": "string"
      },
      "logged_at": {
        "type": "string"
      }
    }
  },
  "CreateMoodEntryResponse": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "body": {
        "type": "string"
      },
      "logged_at": {
        "type": "string"
      },
      "time_label": {
        "type": "string"
      }
    }
  },
  "DeleteMoodEntryId": {
    "type": "integer"
  },
  "DeleteMoodEntryResponse": {
    "type": "object",
    "properties": {
      "message": {
        "type": "string"
      }
    }
  },
  "ListWorkoutLogsQuery": {
    "type": "object",
    "required": [],
    "properties": {
      "date": {
        "type": "string"
      }
    }
  },
  "ListWorkoutLogsResponse": {
    "type": "object",
    "properties": {
      "date": {
        "type": "string"
      },
      "workouts": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "activity_type": {
              "type": "string"
            },
            "calories": {
              "type": "integer",
              "nullable": true
            },
            "distance_m": {
              "type": "integer",
              "nullable": true
            },
            "distance_miles": {
              "type": "number",
              "nullable": true
            },
            "duration_label": {
              "type": "string",
              "nullable": true
            },
            "id": {
              "type": "integer"
            },
            "logged_on": {
              "type": "string"
            },
            "moving_time_s": {
              "type": "integer",
              "nullable": true
            },
            "name": {
              "type": "string"
            },
            "occurred_at": {
              "type": "string"
            },
            "source": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "ListSleepLogsQuery": {
    "type": "object",
    "required": [],
    "properties": {
      "date": {
        "type": "string"
      }
    }
  },
  "ListSleepLogsResponse": {
    "type": "object",
    "properties": {
      "date": {
        "type": "string"
      },
      "sleep_logs": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "awake_seconds": {
              "type": "integer",
              "nullable": true
            },
            "date": {
              "type": "string"
            },
            "deep_sleep_seconds": {
              "type": "integer",
              "nullable": true
            },
            "duration_label": {
              "type": "string",
              "nullable": true
            },
            "ended_at": {
              "type": "string",
              "nullable": true
            },
            "id": {
              "type": "integer"
            },
            "light_sleep_seconds": {
              "type": "integer",
              "nullable": true
            },
            "rem_sleep_seconds": {
              "type": "integer",
              "nullable": true
            },
            "sleep_score": {
              "type": "integer",
              "nullable": true
            },
            "source": {
              "type": "string"
            },
            "started_at": {
              "type": "string",
              "nullable": true
            },
            "total_sleep_seconds": {
              "type": "integer",
              "nullable": true
            }
          }
        }
      }
    }
  },
  "GetFeedQuery": {
    "type": "object",
    "required": [],
    "properties": {
      "before": {
        "type": "string"
      }
    }
  },
  "GetFeedResponse": {
    "type": "object",
    "properties": {
      "days": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "required": [
                  "type",
                  "id",
                  "time_label"
                ],
                "properties": {
                  "body": {
                    "type": "string"
                  },
                  "calories": {
                    "type": "integer"
                  },
                  "carbs_g": {
                    "type": "number"
                  },
                  "distance_m": {
                    "type": "number",
                    "nullable": true
                  },
                  "fat_g": {
                    "type": "number"
                  },
                  "id": {
                    "type": "integer"
                  },
                  "meal_type": {
                    "type": "string",
                    "enum": [
                      "breakfast",
                      "lunch",
                      "dinner",
                      "snack"
                    ]
                  },
                  "moving_time_s": {
                    "type": "integer",
                    "nullable": true
                  },
                  "name": {
                    "type": "string"
                  },
                  "protein_g": {
                    "type": "number"
                  },
                  "source": {
                    "type": "string",
                    "nullable": true
                  },
                  "time_label": {
                    "type": "string"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "food",
                      "mood",
                      "weight",
                      "workout"
                    ]
                  },
                  "weight_lbs": {
                    "type": "number"
                  }
                }
              }
            },
            "relative_label": {
              "type": "string"
            }
          }
        }
      },
      "older_before": {
        "type": "string"
      }
    }
  }
} satisfies Record<string, ContractSchema>
