export interface Trie<T> {
    childs: Record<string, Trie<T>>
    value: T
    isTerminal: boolean
    insert(key: string, value: T): void
    search(key: string): Trie<T> | undefined
    searchPartial(key: string): Trie<T>[]
    // remove(value: T): boolean
}

export function trie<T>(value: T, isTerminal: boolean): Trie<T|undefined> {
    return {
        value,
        isTerminal,
        childs: {},
        insert(key, value) {
            let node = this
            for (const char of key) {
                if (node.childs[char] === undefined) {
                    node.childs[char] = trie(undefined, false)
                }
                node = node.childs[char]
            }
            node.isTerminal = true
            node.value = value
        },
        // Trie-Find(x, key)
        //     for 0 ≤ i < key.length do
        //         if x.Children[key[i]] = nil then
        //             return false
        //         end if
        //         x := x.Children[key[i]]
        //     repeat
        //     return x.Value
        search(key) {
            let node = this
            for (const char of key) {
                if (node.childs[char]) {
                    node = node.childs[char]
                } else {
                    return undefined
                }
            }
            return node
        },
        searchPartial(key) {
            let node = this
            for (const char of key) {
                if (node.childs[char]) {
                    node = node.childs[char]
                }
            }
            const results = []
            const queue = [node]
            while (queue.length) {
                const node = queue.pop()!
                if (node.isTerminal) {
                    results.push(node)
                }
                queue.push(...Object.values(node.childs))
            }
            return results
        }
        // Trie-Delete(x, key)
        //     if key = nil then
        //         if x.Is-Terminal = True then
        //             x.Is-Terminal := False
        //             x.Value := nil
        //         end if
        //         for 0 ≤ i < x.Children.length
        //             if x.Children[i] != nil
        //                 return x
        //             end if
        //         repeat
        //         return nil
        //     end if
        //     x.Children[key[0]] := Trie-Delete(x.Children[key[0]], key[1:])
        //     return x
        // remove(value) {
        //     let node = this
        //     for (const char of value) {

        //         if (node.childs[char]) {
        //             node = node.childs[char]
        //         } else {
        //             break
        //         }
        //     }
        //     if (node) {
        //         node.value = ''
        //         node.isTerminal = false
        //     }
        // }
        // },
    }
}
