'use server'

import { prisma } from '@/lib/db'

/**
 * Get all active categories with their product counts
 */
export async function getActiveCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true
            },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                children: {
                    where: {
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true
                    }
                },
                collection: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true
                    }
                },
                _count: {
                    select: {
                        products: {
                            where: {
                                status: 'PUBLISHED',
                                isActive: true,
                                isDraft: false
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return categories
    } catch (error) {
        console.error('Error fetching active categories:', error)
        return []
    }
}

/**
 * Get top-level categories (categories without parents)
 */
export async function getTopLevelCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
                parentId: null
            },
            include: {
                children: {
                    where: {
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        _count: {
                            select: {
                                products: {
                                    where: {
                                        status: 'PUBLISHED',
                                        isActive: true,
                                        isDraft: false
                                    }
                                }
                            }
                        }
                    }
                },
                products: {
                    where: {
                        status: 'PUBLISHED',
                        isActive: true,
                        isDraft: false
                    },
                    select: {
                        id: true,
                        name: true,
                        thumbnail: true,
                        price: true
                    },
                    take: 3,
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                collection: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        products: {
                            where: {
                                status: 'PUBLISHED',
                                isActive: true,
                                isDraft: false
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return categories
    } catch (error) {
        console.error('Error fetching top-level categories:', error)
        return []
    }
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string) {
    try {
        const category = await prisma.category.findFirst({
            where: {
                slug,
                isActive: true
            },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                children: {
                    where: {
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        _count: {
                            select: {
                                products: {
                                    where: {
                                        status: 'PUBLISHED',
                                        isActive: true,
                                        isDraft: false
                                    }
                                }
                            }
                        }
                    }
                },
                collection: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                        image: true,
                        description: true
                    }
                },
                _count: {
                    select: {
                        products: {
                            where: {
                                status: 'PUBLISHED',
                                isActive: true,
                                isDraft: false
                            }
                        }
                    }
                }
            }
        })

        return category
    } catch (error) {
        console.error('Error fetching category:', error)
        return null
    }
}

/**
 * Get all collections with their categories
 */
export async function getCollections() {
    try {
        const collections = await prisma.collection.findMany({
            where: {
                isActive: true
            },
            include: {
                categories: {
                    where: {
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        _count: {
                            select: {
                                products: {
                                    where: {
                                        status: 'PUBLISHED',
                                        isActive: true,
                                        isDraft: false
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        name: 'asc'
                    }
                },
                _count: {
                    select: {
                        categories: {
                            where: {
                                isActive: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        })

        return collections
    } catch (error) {
        console.error('Error fetching collections:', error)
        return []
    }
}

/**
 * Get a single collection by slug
 */
export async function getCollectionBySlug(slug: string) {
    try {
        const collection = await prisma.collection.findFirst({
            where: {
                slug,
                isActive: true
            },
            include: {
                categories: {
                    where: {
                        isActive: true
                    },
                    include: {
                        _count: {
                            select: {
                                products: {
                                    where: {
                                        status: 'PUBLISHED',
                                        isActive: true,
                                        isDraft: false
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        name: 'asc'
                    }
                }
            }
        })

        return collection
    } catch (error) {
        console.error('Error fetching collection:', error)
        return null
    }
}

/**
 * Get featured categories (categories with most products)
 */
export async function getFeaturedCategories(limit = 6) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true
            },
            include: {
                collection: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        products: {
                            where: {
                                status: 'PUBLISHED',
                                isActive: true,
                                isDraft: false
                            }
                        }
                    }
                }
            },
            orderBy: {
                products: {
                    _count: 'desc'
                }
            },
            take: limit
        })

        return categories
    } catch (error) {
        console.error('Error fetching featured categories:', error)
        return []
    }
}
